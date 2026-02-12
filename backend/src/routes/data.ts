import { Router, type Request, type Response } from 'express';
import { fieldStorageService } from '../services/FieldStorageService.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess } from '../utils/response.js';
import { z } from 'zod';

const router = Router();

// =============================================================================
// GET /api/data/:fieldId - Get specific field value
// =============================================================================

router.get(
  '/:fieldId',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { fieldId } = req.params;
    const userId = req.user!.id;

    // Validate field ID format
    if (!fieldStorageService.validateFieldId(fieldId)) {
      return res.status(400).json({
        error: 'Invalid field ID format',
        message: 'Field ID must follow pattern: module.context.field_name',
      });
    }

    // Get field value
    const fieldData = await fieldStorageService.getFieldValue(userId, fieldId);

    return sendSuccess(res, {
      field_id: fieldId,
      value: (fieldData as any).value || null,
      available: (fieldData as any).available || false,
      source_tool: (fieldData as any).source_tool || 'unknown',
    });
  })
);

// =============================================================================
// POST /api/data/batch - Batch get multiple field values
// =============================================================================

const BatchGetFieldsSchema = z.object({
  field_ids: z.array(z.string()).min(1).max(50),
});

router.post(
  '/batch',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { field_ids } = BatchGetFieldsSchema.parse(req.body);
    const userId = req.user!.id;

    // Validate all field IDs
    const invalidFields = field_ids.filter(id => !fieldStorageService.validateFieldId(id));
    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: 'Invalid field IDs',
        invalid_fields: invalidFields,
      });
    }

    // Batch get field values
    const values = await fieldStorageService.batchGetFields(userId, field_ids);

    return sendSuccess(res, values);
  })
);

export default router;
