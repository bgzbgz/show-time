import { prisma, getSchemaName, queryRaw } from '../config/database.js';
import { toolService } from './ToolService.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import type { DependencyField, DependencyCheck } from '../types/index.js';
import fs from 'fs/promises';
import path from 'path';

// =============================================================================
// Dependency Configuration Types
// =============================================================================

interface DependencyConfig {
  [toolSlug: string]: {
    dependencies: string[]; // Field IDs required
    outputs: string[]; // Field IDs produced
    optional?: boolean;
  };
}

// =============================================================================
// ToolOrchestrator Service
// =============================================================================

export class ToolOrchestrator {
  private dependencyConfig: DependencyConfig = {};
  private dependencyCache: Map<string, unknown> = new Map();

  /**
   * Load dependency configuration from dependencies.json
   */
  async loadDependencyConfig(): Promise<void> {
    try {
      // Check multiple locations for different deploy configs
      const possiblePaths = [
        path.join(process.cwd(), 'config/dependencies.json'),       // rootDir: /backend (config copied into backend)
        path.join(process.cwd(), '../config/dependencies.json'),    // rootDir: / (monorepo root)
      ];
      let configContent: string | null = null;
      for (const p of possiblePaths) {
        try { configContent = await fs.readFile(p, 'utf-8'); break; } catch { /* try next */ }
      }
      if (!configContent) throw new Error('dependencies.json not found');
      const config = JSON.parse(configContent);

      this.dependencyConfig = config.tools || {};

      console.log(`✓ Loaded dependency configuration for ${Object.keys(this.dependencyConfig).length} tools`);
    } catch (error) {
      console.warn('Warning: Could not load dependencies.json, using empty config');
      this.dependencyConfig = {};
    }
  }

  /**
   * Resolve dependencies for a tool
   * Fetches required field values from source tool schemas
   */
  async resolveDependencies(
    toolSlug: string,
    userId: string
  ): Promise<Record<string, DependencyField>> {
    const config = this.dependencyConfig[toolSlug];

    if (!config || !config.dependencies || config.dependencies.length === 0) {
      return {}; // No dependencies
    }

    const resolvedDependencies: Record<string, DependencyField> = {};

    // Fetch each required field
    for (const fieldId of config.dependencies) {
      const field = await this.getFieldValue(userId, fieldId);
      resolvedDependencies[fieldId] = field;
    }

    return resolvedDependencies;
  }

  /**
   * Get a specific field value for a user
   */
  async getFieldValue(userId: string, fieldId: string): Promise<DependencyField> {
    // Check cache first
    const cacheKey = `${userId}:${fieldId}`;
    if (this.dependencyCache.has(cacheKey)) {
      const cachedValue = this.dependencyCache.get(cacheKey);
      return {
        field_id: fieldId,
        source_tool: this.getSourceToolFromFieldId(fieldId),
        value: cachedValue,
        available: true,
      };
    }

    // Find which tool produces this field
    const sourceTool = this.findToolByOutputField(fieldId);

    if (!sourceTool) {
      return {
        field_id: fieldId,
        source_tool: 'unknown',
        value: null,
        available: false,
      };
    }

    // Get tool metadata
    const tool = toolService.getTool(sourceTool);
    const schemaName = getSchemaName(tool.slug, tool.sprint_number);

    // Query field_outputs table
    const query = `
      SELECT fo.field_value
      FROM ${schemaName}.field_outputs fo
      INNER JOIN ${schemaName}.submissions s ON fo.submission_id = s.id
      WHERE s.user_id = $1 AND fo.field_id = $2
      ORDER BY s.updated_at DESC
      LIMIT 1
    `;

    try {
      const results = await queryRaw<Array<{ field_value: unknown }>>(query, [userId, fieldId]);

      if (results.length > 0) {
        const value = results[0]?.field_value;

        // Cache the value
        this.dependencyCache.set(cacheKey, value);

        return {
          field_id: fieldId,
          source_tool: sourceTool,
          value,
          available: true,
        };
      }

      return {
        field_id: fieldId,
        source_tool: sourceTool,
        value: null,
        available: false,
      };
    } catch (error) {
      console.error(`Error fetching field ${fieldId}:`, error);
      return {
        field_id: fieldId,
        source_tool: sourceTool,
        value: null,
        available: false,
      };
    }
  }

  /**
   * Batch get multiple field values
   */
  async batchGetFields(
    userId: string,
    fieldIds: string[]
  ): Promise<Record<string, DependencyField>> {
    const results: Record<string, DependencyField> = {};

    // Group fields by source tool for efficient querying
    const fieldsByTool: Record<string, string[]> = {};

    for (const fieldId of fieldIds) {
      const sourceTool = this.findToolByOutputField(fieldId);
      if (sourceTool) {
        if (!fieldsByTool[sourceTool]) {
          fieldsByTool[sourceTool] = [];
        }
        fieldsByTool[sourceTool].push(fieldId);
      }
    }

    // Query each tool's field_outputs once
    for (const [toolSlug, fields] of Object.entries(fieldsByTool)) {
      const tool = toolService.getTool(toolSlug);
      const schemaName = getSchemaName(tool.slug, tool.sprint_number);

      const placeholders = fields.map((_, i) => `$${i + 2}`).join(',');
      const query = `
        SELECT fo.field_id, fo.field_value
        FROM ${schemaName}.field_outputs fo
        INNER JOIN ${schemaName}.submissions s ON fo.submission_id = s.id
        WHERE s.user_id = $1 AND fo.field_id IN (${placeholders})
      `;

      const queryResults = await queryRaw<Array<{ field_id: string; field_value: unknown }>>(
        query,
        [userId, ...fields]
      );

      // Map results
      for (const field of fields) {
        const result = queryResults.find(r => r.field_id === field);
        results[field] = {
          field_id: field,
          source_tool: toolSlug,
          value: result?.field_value || null,
          available: !!result,
        };
      }
    }

    return results;
  }

  /**
   * Check if user can access tool (all dependencies satisfied)
   */
  async checkUnlockStatus(toolSlug: string, userId: string): Promise<DependencyCheck> {
    const config = this.dependencyConfig[toolSlug];

    // If no dependencies, tool is always accessible
    if (!config || !config.dependencies || config.dependencies.length === 0) {
      return {
        tool_slug: toolSlug,
        unlocked: true,
        missing_dependencies: [],
        required_fields: [],
      };
    }

    // Fetch all required fields
    const dependencies = await this.resolveDependencies(toolSlug, userId);
    const requiredFields = Object.values(dependencies);

    // Find missing dependencies
    const missing = requiredFields
      .filter(field => !field.available)
      .map(field => field.field_id);

    return {
      tool_slug: toolSlug,
      unlocked: missing.length === 0,
      missing_dependencies: missing,
      required_fields: requiredFields,
    };
  }

  /**
   * Update user progress and unlock dependent tools
   */
  async updateProgress(
    userId: string,
    toolSlug: string,
    status: 'unlocked' | 'in_progress' | 'completed'
  ): Promise<void> {
    // Update progress record
    await prisma.user_progress.update({
      where: {
        user_id_tool_slug: {
          user_id: userId,
          tool_slug: toolSlug,
        },
      },
      data: {
        status,
        ...(status === 'unlocked' && { unlocked_at: new Date() }),
        ...(status === 'in_progress' && { started_at: new Date() }),
        ...(status === 'completed' && {
          completed_at: new Date(),
          progress_percentage: 100,
        }),
      },
    });

    // If tool completed, unlock dependent tools
    if (status === 'completed') {
      await this.unlockDependentTools(userId, toolSlug);
    }

    // Clear cache for this user
    this.clearUserCache(userId);
  }

  /**
   * Unlock tools that depend on the completed tool
   */
  async unlockDependentTools(userId: string, completedToolSlug: string): Promise<void> {
    // Find tools that depend on this tool
    const dependentTools = this.findDependentTools(completedToolSlug);

    for (const toolSlug of dependentTools) {
      // Check if all dependencies are now satisfied
      const unlockStatus = await this.checkUnlockStatus(toolSlug, userId);

      if (unlockStatus.unlocked) {
        // Get current status
        const currentProgress = await prisma.user_progress.findUnique({
          where: {
            user_id_tool_slug: {
              user_id: userId,
              tool_slug: toolSlug,
            },
          },
        });

        // Only unlock if currently locked
        if (currentProgress?.status === 'locked') {
          await this.updateProgress(userId, toolSlug, 'unlocked');
          console.log(`✓ Unlocked tool ${toolSlug} for user ${userId}`);
        }
      }
    }
  }

  /**
   * Find tools that depend on a specific tool's outputs
   */
  private findDependentTools(toolSlug: string): string[] {
    const config = this.dependencyConfig[toolSlug];
    if (!config || !config.outputs) {
      return [];
    }

    const outputs = config.outputs;
    const dependentTools: string[] = [];

    // Find tools whose dependencies include any of these outputs
    for (const [otherToolSlug, otherConfig] of Object.entries(this.dependencyConfig)) {
      if (otherToolSlug === toolSlug) continue;

      const dependencies = otherConfig.dependencies || [];
      const hasMatchingDependency = dependencies.some(dep =>
        outputs.some(output => dep.startsWith(output))
      );

      if (hasMatchingDependency) {
        dependentTools.push(otherToolSlug);
      }
    }

    return dependentTools;
  }

  /**
   * Find which tool produces a specific field
   */
  private findToolByOutputField(fieldId: string): string | null {
    for (const [toolSlug, config] of Object.entries(this.dependencyConfig)) {
      if (config.outputs && config.outputs.some(output => fieldId.startsWith(output))) {
        return toolSlug;
      }
    }
    return null;
  }

  /**
   * Get source tool name from field ID
   */
  private getSourceToolFromFieldId(fieldId: string): string {
    const tool = this.findToolByOutputField(fieldId);
    return tool || 'unknown';
  }

  /**
   * Clear cache for a specific user
   */
  clearUserCache(userId: string): void {
    const keysToDelete: string[] = [];
    for (const key of this.dependencyCache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.dependencyCache.delete(key));
  }

  /**
   * Clear entire cache
   */
  clearCache(): void {
    this.dependencyCache.clear();
  }
}

// Export singleton instance
export const toolOrchestrator = new ToolOrchestrator();
