import { Request, Response, NextFunction } from 'express';
import { createDocService, getDocByIdService } from '../services/docServices';
import { Model, Types } from 'mongoose';

import { ApiResponse } from '../types/ApiTypes';
import { IDocData } from '../types/DocTypes';
import { databasesMapper } from '../types/CollectionTypes';

/**
 * Controller to fetch all data entries for a specific docId.
 *
 * @param {Request} req - Express request object containing appSheetId parameter.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const getDocByIdController = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  const { docId } = req.params;

  if (!Types.ObjectId.isValid(docId)) {
    const errorResponse: ApiResponse = { status: 'error', message: 'Invalid docId.' };
    res.status(400).json(errorResponse);
    return;
  }

  try {
    const docData = await getDocByIdService(docId);
    const successResponse: ApiResponse = { status: 'success', data: docData };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    next(error);
  }
};

/**
 * Controller to create a new AppSheet.
 *
 * @param {Request} req - Express request object containing title, description, additionalData, and type in the body.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const createDocController = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  try {
    const tempDocData: IDocData = req.body;

    if (!tempDocData) {
      const errorResponse: ApiResponse = { status: 'error', message: 'Missing variables' };
      res.status(400).json(errorResponse);
      return;
    }

    const modal: Model<any> = databasesMapper[tempDocData.databaseModel as keyof typeof databasesMapper];

    if (!modal) {
      const errorResponse: ApiResponse = { status: 'error', message: 'Invalid collection database name' };
      res.status(400).json(errorResponse);
      return;
    }

    const docData = await createDocService(tempDocData, modal);

    const successResponse: ApiResponse = { status: 'success', data: docData };

    res.status(201).json(successResponse);
  } catch (error) {
    console.error('Error creating sheet:', error);
    next(error);
  }
};
