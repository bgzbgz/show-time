import { prisma, getSchemaName, queryRaw } from '../config/database.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import type { Tool, ToolMetadata, Submission, SubmissionStatus } from '../types/index.js';
import fs from 'fs/promises';
import path from 'path';

// =============================================================================
// ToolService
// =============================================================================

export class ToolService {
  private toolRegistry: Tool[] = [];
  private toolsBySlug: Map<string, Tool> = new Map();

  /**
   * Load tool registry and dependencies from config files
   */
  async loadToolRegistry(): Promise<void> {
    try {
      // Load tool-registry.json (check multiple locations for different deploy configs)
      const possiblePaths = [
        path.join(process.cwd(), 'config/tool-registry.json'),       // rootDir: / (monorepo)
        path.join(process.cwd(), '../config/tool-registry.json'),    // rootDir: /backend
      ];
      let registryContent: string | null = null;
      for (const p of possiblePaths) {
        try { registryContent = await fs.readFile(p, 'utf-8'); break; } catch { /* try next */ }
      }
      if (!registryContent) throw new Error('tool-registry.json not found in any expected location');
      const registry = JSON.parse(registryContent);

      this.toolRegistry = registry.tools || [];

      // Build slug index
      this.toolRegistry.forEach(tool => {
        this.toolsBySlug.set(tool.slug, tool);
      });

      console.log(`✓ Loaded ${this.toolRegistry.length} tools from registry`);
    } catch (error) {
      console.error('Failed to load tool registry:', error);
      throw error;
    }
  }

  /**
   * Get all tools
   */
  getTools(): Tool[] {
    return this.toolRegistry;
  }

  /**
   * Get tool by slug
   */
  getTool(slug: string): Tool {
    const tool = this.toolsBySlug.get(slug);
    if (!tool) {
      throw new NotFoundError(`Tool not found: ${slug}`);
    }
    return tool;
  }

  /**
   * Get tools with user progress
   */
  async getToolsWithProgress(userId: string): Promise<ToolMetadata[]> {
    // Get all user progress
    const progressRecords = await prisma.user_progress.findMany({
      where: { user_id: userId },
    });

    const progressBySlug = new Map(
      progressRecords.map(p => [p.tool_slug, p])
    );

    // Combine tool metadata with progress
    return this.toolRegistry.map(tool => {
      const progress = progressBySlug.get(tool.slug);
      return {
        ...tool,
        user_status: progress?.status as any,
        user_progress: progress?.progress_percentage || 0,
        unlocked: progress?.status !== 'locked',
      };
    });
  }

  /**
   * Get user's submission for a tool
   */
  async getSubmission(userId: string, toolSlug: string): Promise<Submission | null> {
    const tool = this.getTool(toolSlug);
    const schemaName = getSchemaName(tool.slug, tool.sprint_number);

    // Query submissions table in tool's schema
    const query = `
      SELECT * FROM ${schemaName}.submissions
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    const results = await queryRaw<Submission[]>(query, [userId]);
    return results[0] || null;
  }

  /**
   * Create or update submission
   */
  async saveSubmission(
    userId: string,
    organizationId: string | null,
    toolSlug: string,
    data: Record<string, unknown>,
    status: SubmissionStatus = 'draft'
  ): Promise<Submission> {
    const tool = this.getTool(toolSlug);
    const schemaName = getSchemaName(tool.slug, tool.sprint_number);

    // Check if submission exists
    const existing = await this.getSubmission(userId, toolSlug);

    if (existing) {
      // Update existing submission
      const query = `
        UPDATE ${schemaName}.submissions
        SET data = $1, status = $2, version = version + 1, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;

      const results = await queryRaw<Submission[]>(query, [
        JSON.stringify(data),
        status,
        existing.id,
      ]);

      return results[0]!;
    } else {
      // Create new submission
      const query = `
        INSERT INTO ${schemaName}.submissions
        (user_id, organization_id, data, status, version)
        VALUES ($1, $2, $3, $4, 1)
        RETURNING *
      `;

      const results = await queryRaw<Submission[]>(query, [
        userId,
        organizationId,
        JSON.stringify(data),
        status,
      ]);

      return results[0]!;
    }
  }

  /**
   * Submit tool for completion
   */
  async submitTool(
    userId: string,
    toolSlug: string,
    data: Record<string, unknown>
  ): Promise<Submission> {
    const tool = this.getTool(toolSlug);

    // Validate required fields (basic validation)
    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError('Submission data cannot be empty');
    }

    // Get user's organization
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { organization_id: true },
    });

    // Save submission with 'submitted' status
    const submission = await this.saveSubmission(
      userId,
      user?.organization_id || null,
      toolSlug,
      data,
      'submitted'
    );

    // Update submission timestamps
    const schemaName = getSchemaName(tool.slug, tool.sprint_number);
    const query = `
      UPDATE ${schemaName}.submissions
      SET submitted_at = NOW(), completed_at = NOW(), status = 'completed'
      WHERE id = $1
      RETURNING *
    `;

    const results = await queryRaw<Submission[]>(query, [submission.id]);

    return results[0]!;
  }

  /**
   * Delete submission
   */
  async deleteSubmission(userId: string, toolSlug: string): Promise<void> {
    const tool = this.getTool(toolSlug);
    const schemaName = getSchemaName(tool.slug, tool.sprint_number);

    const query = `
      DELETE FROM ${schemaName}.submissions
      WHERE user_id = $1
    `;

    await queryRaw(query, [userId]);
  }

  /**
   * Get submission count for a tool
   */
  async getSubmissionCount(toolSlug: string): Promise<number> {
    const tool = this.getTool(toolSlug);
    const schemaName = getSchemaName(tool.slug, tool.sprint_number);

    const query = `
      SELECT COUNT(*) as count FROM ${schemaName}.submissions
    `;

    const results = await queryRaw<Array<{ count: string }>>(query);
    return parseInt(results[0]?.count || '0', 10);
  }
}

// Export singleton instance
export const toolService = new ToolService();
