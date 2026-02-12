import { z } from 'zod';

// =============================================================================
// Common Schemas
// =============================================================================

export const SubmissionStatusSchema = z.enum([
  'draft',
  'in_progress',
  'submitted',
  'completed',
]);

export const ToolStatusSchema = z.enum([
  'locked',
  'unlocked',
  'in_progress',
  'completed',
]);

// =============================================================================
// Submission Schemas
// =============================================================================

export const CreateSubmissionSchema = z.object({
  data: z.record(z.unknown()).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Submission data cannot be empty' }
  ),
  status: SubmissionStatusSchema.optional().default('draft'),
});

export const UpdateSubmissionSchema = z.object({
  data: z.record(z.unknown()).optional(),
  status: SubmissionStatusSchema.optional(),
}).refine(
  (data) => data.data !== undefined || data.status !== undefined,
  { message: 'Either data or status must be provided' }
);

export const SubmitToolSchema = z.object({
  data: z.record(z.unknown()).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Submission data cannot be empty for submission' }
  ),
});

// =============================================================================
// Field Output Schemas
// =============================================================================

export const FieldOutputSchema = z.object({
  field_id: z.string().min(1).regex(
    /^[a-z]+\.[a-z_]+(\.[a-z_]+)?$/,
    'Field ID must follow pattern: module.context.field_name'
  ),
  field_value: z.unknown(),
});

// =============================================================================
// Progress Schemas
// =============================================================================

export const UpdateProgressSchema = z.object({
  status: ToolStatusSchema,
  progress_percentage: z.number().int().min(0).max(100).optional(),
});

// =============================================================================
// Export Schemas
// =============================================================================

export const ExportRequestSchema = z.object({
  format: z.enum(['json', 'pdf']).default('json'),
  include_dependencies: z.boolean().optional().default(true),
});

// =============================================================================
// Type Exports
// =============================================================================

export type CreateSubmissionInput = z.infer<typeof CreateSubmissionSchema>;
export type UpdateSubmissionInput = z.infer<typeof UpdateSubmissionSchema>;
export type SubmitToolInput = z.infer<typeof SubmitToolSchema>;
export type FieldOutputInput = z.infer<typeof FieldOutputSchema>;
export type UpdateProgressInput = z.infer<typeof UpdateProgressSchema>;
export type ExportRequestInput = z.infer<typeof ExportRequestSchema>;
