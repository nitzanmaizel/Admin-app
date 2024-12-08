import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { bulkUpdateDocItemsService, createDocItemService, deleteDocItemsService, updateDocItemService } from '../services/docItemServices';
import { ApiResponse } from '../types/ApiTypes';

/**
 * Controller to create a new AppSheet item.
 *
 * @param {Request} req - Express request object containing appSheetId and itemId parameters and additionalData in the body.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const createDocItemController = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  const { docId, itemDataModalId } = req.params;
  const { additionalData } = req.body;

  if (!Types.ObjectId.isValid(docId)) {
    const errorResponse: ApiResponse = { status: 'error', message: 'Invalid docId.' };
    res.status(400).json(errorResponse);
    return;
  }

  if (!Types.ObjectId.isValid(itemDataModalId)) {
    const errorResponse: ApiResponse = { status: 'error', message: 'Invalid itemDataModalId.' };
    res.status(400).json(errorResponse);
    return;
  }

  try {
    const docItem = await createDocItemService({ docId, itemDataModalId, userAdditionalData: additionalData });
    const successResponse: ApiResponse = { status: 'success', data: docItem };
    res.status(201).json(successResponse);
  } catch (error) {
    console.error('Error creating sheet item:', error);
    next(error);
  }
};

/**
 * Controller to delete multiple Doc related items.
 *
 * @param {Request} req - Express request object containing docId in the params and itemIds in the body.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const deleteDocItemsController = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  const { docId } = req.params;
  const { itemDocIds } = req.body;

  if (!Types.ObjectId.isValid(docId)) {
    const errorResponse: ApiResponse = { status: 'error', message: 'Invalid docId.' };
    res.status(400).json(errorResponse);
    return;
  }

  if (!Array.isArray(itemDocIds) || itemDocIds.length === 0) {
    const errorResponse: ApiResponse = { status: 'error', message: 'Invalid or empty itemDocIds array.' };
    res.status(400).json(errorResponse);
    return;
  }

  try {
    const results = await deleteDocItemsService(docId, itemDocIds);
    const successResponse: ApiResponse = { status: 'success', data: results };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error('Error deleting sheet items:', error);
    next(error);
  }
};

/**
 * Controller to update an existing doc item.
 *
 * @param {Request} req - Express request object containing docId and docItemId parameters and additionalData in the body.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const updateDocItemController = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  const { docId, docItemId } = req.params;
  const { additionalData } = req.body;

  if (!Types.ObjectId.isValid(docId)) {
    const errorResponse: ApiResponse = { status: 'error', message: 'Invalid Doc Id.' };
    res.status(400).json(errorResponse);
    return;
  }

  if (!Types.ObjectId.isValid(docItemId)) {
    const errorResponse: ApiResponse = { status: 'error', message: 'Invalid Doc Item Id.' };
    res.status(400).json(errorResponse);
    return;
  }

  if (!additionalData || !additionalData.length) {
    const errorResponse: ApiResponse = { status: 'error', message: 'Additional data is required' };
    res.status(400).json(errorResponse);
    return;
  }

  try {
    const docItem = await updateDocItemService(docId, docItemId, additionalData);
    if (!docItem) {
      const errorResponse: ApiResponse = { status: 'error', message: 'Doc item not found' };
      res.status(404).json(errorResponse);
      return;
    }

    const successResponse: ApiResponse = { status: 'success', data: docItem, message: 'Doc item updated successfully' };
    res.status(200).json(successResponse);
  } catch (error) {
    console.error('Error updating Doc item:', error);
    next(error);
  }
};

/**
 * Controller to bulk update multiple doc items with the same additional data changes.
 *
 * Expects the following request structure:
 *   URL Params:
 *     - docId: The ID of the Doc.
 *   Body:
 *     - docItemIds: An array of docItem IDs to update.
 *     - additionalData: An array of { key: string; value: string } representing the changes to apply.
 *
 * @param {Request} req - Express request object.
 * @param {Response<ApiResponse>} res - Express response object.
 * @param {NextFunction} next - Express next middleware function for error handling.
 * @returns {Promise<void>}
 *   Sends a JSON response with the format:
 *   {
 *     status: 'success',
 *     message: string,
 *     data: {
 *       updatedItems: IDocItemData[],
 *       failedItems: string[]
 *     }
 *   }
 *   Or an error response if something goes wrong.
 *
 * @throws {Error} If an unexpected error occurs, it calls `next(error)` for centralized error handling.
 */
export const bulkUpdateDocItemsController = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  const { docId } = req.params;
  const { docItemIds, additionalData } = req.body as {
    docItemIds: string[];
    additionalData: { key: string; value: string }[];
  };

  console.log({ docId, docItemIds, additionalData });

  if (!Types.ObjectId.isValid(docId)) {
    res.status(400).json({ status: 'error', message: 'Invalid Doc Id.' });
    return;
  }

  if (!Array.isArray(docItemIds) || docItemIds.length === 0) {
    res.status(400).json({ status: 'error', message: 'docItemIds array is required.' });
    return;
  }

  if (!Array.isArray(additionalData) || additionalData.length === 0) {
    res.status(400).json({ status: 'error', message: 'additionalData array is required.' });
    return;
  }

  try {
    const { updatedItems, failedItems } = await bulkUpdateDocItemsService(docId, docItemIds, additionalData);

    const message = failedItems.length ? `Some items failed to update: ${failedItems.join(', ')}` : 'All items updated successfully';

    res.status(200).json({
      status: 'success',
      message,
      data: { updatedItems, failedItems },
    });
  } catch (error) {
    console.error('Error updating doc items in bulk with same changes:', error);
    next(error);
  }
};
