import { prisma } from '../config/database.js';
import { toolService } from './ToolService.js';
import { toolOrchestrator } from './ToolOrchestrator.js';
import { ValidationError } from '../middleware/errorHandler.js';
import type { UserProgress, ProgressSummary, ToolStatus } from '../types/index.js';

// =============================================================================
// ProgressService
// =============================================================================

export class ProgressService {
  /**
   * Initialize progress for new user (31 tools, Sprint 0 unlocked)
   */
  async initializeUserProgress(userId: string): Promise<void> {
    const tools = toolService.getTools();

    const progressEntries = tools.map((tool, index) => ({
      user_id: userId,
      tool_slug: tool.slug,
      status: index === 0 ? ('unlocked' as ToolStatus) : ('locked' as ToolStatus),
      progress_percentage: 0,
      unlocked_at: index === 0 ? new Date() : null,
      started_at: null,
      completed_at: null,
    }));

    await prisma.user_progress.createMany({
      data: progressEntries,
      skipDuplicates: true,
    });

    console.log(`✓ Initialized progress for user ${userId}: 31 tools (Sprint 0 unlocked)`);
  }

  /**
   * Get progress for specific tool
   */
  async getToolProgress(userId: string, toolSlug: string): Promise<UserProgress | null> {
    const progress = await prisma.user_progress.findUnique({
      where: {
        user_id_tool_slug: {
          user_id: userId,
          tool_slug: toolSlug,
        },
      },
    });

    return progress as UserProgress | null;
  }

  /**
   * Update tool status with validation
   */
  async updateToolStatus(
    userId: string,
    toolSlug: string,
    newStatus: ToolStatus
  ): Promise<UserProgress> {
    // Get current progress
    const current = await this.getToolProgress(userId, toolSlug);

    if (!current) {
      throw new ValidationError(`No progress record found for tool ${toolSlug}`);
    }

    // Validate status transition
    this.validateStatusTransition(current.status as ToolStatus, newStatus);

    // Update timestamps based on new status
    const updateData: any = { status: newStatus };

    if (newStatus === 'unlocked' && !current.unlocked_at) {
      updateData.unlocked_at = new Date();
    }

    if (newStatus === 'in_progress' && !current.started_at) {
      updateData.started_at = new Date();
    }

    if (newStatus === 'completed') {
      updateData.completed_at = new Date();
      updateData.progress_percentage = 100;
    }

    const updated = await prisma.user_progress.update({
      where: {
        user_id_tool_slug: {
          user_id: userId,
          tool_slug: toolSlug,
        },
      },
      data: updateData,
    });

    return updated as UserProgress;
  }

  /**
   * Validate status transition
   */
  private validateStatusTransition(currentStatus: ToolStatus, newStatus: ToolStatus): void {
    const validTransitions: Record<ToolStatus, ToolStatus[]> = {
      locked: ['unlocked'],
      unlocked: ['in_progress', 'completed'],
      in_progress: ['completed'],
      completed: [], // Cannot transition from completed
    };

    const allowedTransitions = validTransitions[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new ValidationError(
        `Invalid status transition: ${currentStatus} → ${newStatus}. ` +
        `Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`
      );
    }
  }

  /**
   * Calculate progress percentage based on submission data
   */
  calculateProgressPercentage(
    submissionData: Record<string, unknown>,
    requiredFields: string[]
  ): number {
    if (requiredFields.length === 0) {
      return 0;
    }

    const completedFields = requiredFields.filter(field => {
      const value = submissionData[field];
      return value !== null && value !== undefined && value !== '';
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }

  /**
   * Update progress percentage
   */
  async updateProgressPercentage(
    userId: string,
    toolSlug: string,
    percentage: number
  ): Promise<void> {
    await prisma.user_progress.update({
      where: {
        user_id_tool_slug: {
          user_id: userId,
          tool_slug: toolSlug,
        },
      },
      data: {
        progress_percentage: Math.max(0, Math.min(100, percentage)),
      },
    });
  }

  /**
   * Get overall progress summary for user
   */
  async getProgressSummary(userId: string): Promise<ProgressSummary> {
    const progressRecords = await prisma.user_progress.findMany({
      where: { user_id: userId },
      orderBy: { tool_slug: 'asc' },
    });

    const completed = progressRecords.filter(p => p.status === 'completed').length;
    const inProgress = progressRecords.filter(p => p.status === 'in_progress').length;
    const unlocked = progressRecords.filter(p => p.status === 'unlocked').length;
    const locked = progressRecords.filter(p => p.status === 'locked').length;
    const totalTools = progressRecords.length;

    // Find current tool (lowest sprint number that's in_progress or unlocked)
    const currentTool = this.findCurrentTool(progressRecords as UserProgress[]);

    return {
      total_tools: totalTools,
      completed_tools: completed,
      in_progress_tools: inProgress,
      unlocked_tools: unlocked,
      locked_tools: locked,
      overall_completion_percentage: Math.round((completed / totalTools) * 100),
      current_tool: currentTool,
      progress: progressRecords as UserProgress[],
    };
  }

  /**
   * Find the current tool user should work on
   */
  private findCurrentTool(progressRecords: UserProgress[]): string | null {
    const tools = toolService.getTools();

    // Find first in_progress tool
    const inProgress = progressRecords.find(p => p.status === 'in_progress');
    if (inProgress) {
      return inProgress.tool_slug;
    }

    // Find first unlocked tool (by sprint order)
    const unlockedProgress = progressRecords.filter(p => p.status === 'unlocked');

    if (unlockedProgress.length > 0) {
      // Sort by sprint number
      const sortedUnlocked = unlockedProgress.map(p => {
        const tool = tools.find(t => t.slug === p.tool_slug);
        return { progress: p, sprintNumber: tool?.sprint_number || 999 };
      }).sort((a, b) => a.sprintNumber - b.sprintNumber);

      return sortedUnlocked[0]?.progress.tool_slug || null;
    }

    // All completed or all locked
    if (progressRecords.every(p => p.status === 'completed')) {
      return 'program-overview'; // Last tool
    }

    return null;
  }

  /**
   * Get next available tool for user
   */
  async getNextAvailableTool(userId: string): Promise<{
    tool_slug: string | null;
    message: string;
  }> {
    const summary = await this.getProgressSummary(userId);

    if (summary.current_tool) {
      const tool = toolService.getTool(summary.current_tool);
      return {
        tool_slug: summary.current_tool,
        message: `Continue working on Sprint ${tool.sprint_number}: ${tool.name}`,
      };
    }

    if (summary.completed_tools === summary.total_tools) {
      return {
        tool_slug: null,
        message: 'Congratulations! You have completed all 31 tools.',
      };
    }

    return {
      tool_slug: null,
      message: 'Complete prerequisite tools to unlock the next sprint.',
    };
  }

  /**
   * Unlock dependent tools after completion
   */
  async unlockDependentTools(userId: string, completedToolSlug: string): Promise<string[]> {
    // Use orchestrator to unlock tools
    await toolOrchestrator.unlockDependentTools(userId, completedToolSlug);

    // Get list of newly unlocked tools
    const progress = await prisma.user_progress.findMany({
      where: {
        user_id: userId,
        status: 'unlocked',
      },
    });

    return progress.map(p => p.tool_slug);
  }

  /**
   * Get time spent on tool
   */
  getTimeSpent(progress: UserProgress): number | null {
    if (!progress.started_at || !progress.completed_at) {
      return null;
    }

    const startTime = new Date(progress.started_at).getTime();
    const endTime = new Date(progress.completed_at).getTime();
    const diffMs = endTime - startTime;

    // Return time in hours
    return Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
  }

  /**
   * Get average completion time for a tool
   */
  async getAverageCompletionTime(toolSlug: string): Promise<number | null> {
    const completedProgress = await prisma.user_progress.findMany({
      where: {
        tool_slug: toolSlug,
        status: 'completed',
      },
    });

    if (completedProgress.length === 0) {
      return null;
    }

    const times = completedProgress
      .map(p => this.getTimeSpent(p as UserProgress))
      .filter((t): t is number => t !== null);

    if (times.length === 0) {
      return null;
    }

    const average = times.reduce((sum, t) => sum + t, 0) / times.length;
    return Math.round(average * 10) / 10;
  }
}

// Export singleton instance
export const progressService = new ProgressService();
