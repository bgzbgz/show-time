import { getSchemaName, queryRaw } from '../config/database.js';
import { toolService } from './ToolService.js';
import { toolOrchestrator } from './ToolOrchestrator.js';
import type { FieldOutput } from '../types/index.js';

// =============================================================================
// FieldStorageService
// =============================================================================

export class FieldStorageService {
  private outputFieldDefinitions: Map<string, string[]> = new Map();

  /**
   * Load output field definitions from config
   */
  async loadOutputFieldDefinitions(): Promise<void> {
    // Load from orchestrator's dependency config
    // The config maps tool slugs to their output fields
    await toolOrchestrator.loadDependencyConfig();

    // Output fields are defined in the dependency config
    console.log('✓ Loaded field output definitions');
  }

  /**
   * Extract recognized output fields from submission data
   */
  extractFieldOutputs(
    submissionData: Record<string, unknown>,
    toolSlug: string
  ): Map<string, unknown> {
    const extractedFields = new Map<string, unknown>();

    // Get expected output fields for this tool from config
    const config = (toolOrchestrator as any).dependencyConfig[toolSlug];
    const outputFields = config?.outputs || [];

    // Extract each recognized field from submission data
    for (const fieldId of outputFields) {
      const value = this.getNestedValue(submissionData, fieldId);
      if (value !== undefined && value !== null) {
        extractedFields.set(fieldId, value);
      }
    }

    return extractedFields;
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    const keys = path.split('.');
    let current: any = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * Save field outputs to database
   */
  async saveFieldOutputs(
    submissionId: string,
    schemaName: string,
    fieldMap: Map<string, unknown>
  ): Promise<void> {
    // Delete existing field outputs for this submission
    await this.deleteFieldOutputs(submissionId, schemaName);

    // Insert new field outputs
    for (const [fieldId, fieldValue] of fieldMap.entries()) {
      const query = `
        INSERT INTO ${schemaName}.field_outputs (submission_id, field_id, field_value)
        VALUES ($1, $2, $3)
      `;

      await queryRaw(query, [submissionId, fieldId, JSON.stringify(fieldValue)]);
    }
  }

  /**
   * Delete field outputs for a submission
   */
  async deleteFieldOutputs(submissionId: string, schemaName: string): Promise<void> {
    const query = `
      DELETE FROM ${schemaName}.field_outputs
      WHERE submission_id = $1
    `;

    await queryRaw(query, [submissionId]);
  }

  /**
   * Get field value for a user
   */
  async getFieldValue(userId: string, fieldId: string): Promise<unknown> {
    return toolOrchestrator.getFieldValue(userId, fieldId);
  }

  /**
   * Batch get multiple field values
   */
  async batchGetFields(
    userId: string,
    fieldIds: string[]
  ): Promise<Record<string, unknown>> {
    const results = await toolOrchestrator.batchGetFields(userId, fieldIds);

    // Convert to simple value map
    const valueMap: Record<string, unknown> = {};
    for (const [fieldId, field] of Object.entries(results)) {
      valueMap[fieldId] = field.value;
    }

    return valueMap;
  }

  /**
   * Validate field ID format
   */
  validateFieldId(fieldId: string): boolean {
    // Format: module.context.field_name
    // Example: identity.personal_dream
    const pattern = /^[a-z]+\.[a-z_]+(\.[a-z_]+)?$/;
    return pattern.test(fieldId);
  }

  /**
   * Get all field outputs for a submission
   */
  async getSubmissionFieldOutputs(
    submissionId: string,
    schemaName: string
  ): Promise<FieldOutput[]> {
    const query = `
      SELECT id, submission_id, field_id, field_value, created_at
      FROM ${schemaName}.field_outputs
      WHERE submission_id = $1
      ORDER BY field_id
    `;

    const results = await queryRaw<FieldOutput[]>(query, [submissionId]);
    return results;
  }

  /**
   * Process submission and extract field outputs
   */
  async processSubmission(
    submissionId: string,
    submissionData: Record<string, unknown>,
    toolSlug: string
  ): Promise<number> {
    // Get tool metadata
    const tool = toolService.getTool(toolSlug);
    const schemaName = getSchemaName(tool.slug, tool.sprint_number);

    // Extract recognized fields
    const fieldMap = this.extractFieldOutputs(submissionData, toolSlug);

    // Save to database
    await this.saveFieldOutputs(submissionId, schemaName, fieldMap);

    console.log(`✓ Extracted ${fieldMap.size} field outputs for ${toolSlug}`);

    return fieldMap.size;
  }
}

// Export singleton instance
export const fieldStorageService = new FieldStorageService();
