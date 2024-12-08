import { Request, Response, NextFunction } from 'express';
import { google, sheets_v4 } from 'googleapis';
import { Model, Types } from 'mongoose';
import {
  createGoogleSheetService,
  getGoogleSheetService,
  updateGoogleSheetDataService,
  loadGoogleSheetToDB,
} from '../services/googleSheetServices';
import { getDocByIdService } from '../services/docServices';
import { ApiResponse } from '../types/ApiTypes';
import { databasesMapper } from '../types/CollectionTypes';
import { headerSoldierMap } from '../types/SoldierItemTypes';
import { transformDocItemsToSheetData } from '../utils/googleSheetUtils';

const dataModel = 'database-soldiers';

const headerKeysMapper = {
  'database-soldiers': headerSoldierMap,
};

export const downloadGoogleSheetController = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { googleSheetId } = req.params;
    const format = (req.query.format as string) || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    // Initialize Google OAuth2 Client
    const auth = req.oauth2Client;
    const drive = google.drive({ version: 'v3', auth });

    // Define the MIME type for the export
    const mimeTypeMap: { [key: string]: string } = {
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
      pdf: 'application/pdf',
    };

    const mimeType = mimeTypeMap[format] || format;

    // Export the file
    const response = await drive.files.export({ fileId: googleSheetId, mimeType }, { responseType: 'stream' });

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="document.${format}"`);

    // Pipe the response to the client
    response.data
      .on('end', () => {
        console.log('Done downloading file.');
      })
      .on('error', (err: Error) => {
        console.error('Error downloading file.');
        next(err);
      })
      .pipe(res);
  } catch (error) {
    console.error('Error downloading Google Sheet:', error);
    next(error);
  }
};

export const loadGoogleSheetController = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  const { googleSheetId, tabName = 'תע"מ 2024' } = req.params;
  const auth = req.oauth2Client;

  if (!googleSheetId) {
    const errorResponse: ApiResponse = { status: 'error', message: 'Invalid googleSheetId.' };
    res.status(400).json(errorResponse);
    return;
  }

  try {
    const sheetData = await getGoogleSheetService(googleSheetId, tabName, auth);
    if (!sheetData) {
      const errorResponse: ApiResponse = { status: 'error', message: 'Missing Data in Google Sheet.' };
      res.status(404).json(errorResponse);
      return;
    }

    const modal: Model<any> = databasesMapper[dataModel as keyof typeof databasesMapper];

    const headerKeysMap = headerKeysMapper[dataModel as keyof typeof headerKeysMapper];

    console.log({ headerKeysMap });

    await loadGoogleSheetToDB(sheetData, modal, headerKeysMap);

    const successResponse: ApiResponse = { status: 'success', data: sheetData };
    res.status(200).send(successResponse);
  } catch (error) {
    console.error('Error retrieving full sheet data:', error);
    next(error);
  }
};

export const createGoogleSheetController = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { docId } = req.params;
    const auth = req.oauth2Client;

    if (!Types.ObjectId.isValid(docId)) {
      const errorResponse: ApiResponse = { status: 'error', message: 'Invalid docId.' };
      res.status(400).json(errorResponse);
      return;
    }

    const docData = await getDocByIdService(docId);

    if (!docData) {
      const errorResponse: ApiResponse = { status: 'error', message: 'Doc not found.' };
      res.status(404).json(errorResponse);
      return;
    }

    const { docItems = [], title } = docData;

    const googleSheetRawData = transformDocItemsToSheetData(docItems);

    const googleSheetId = await createGoogleSheetService(title, googleSheetRawData, auth);

    if (!googleSheetId) {
      const errorResponse: ApiResponse = { status: 'error', message: 'Error creating Google Sheet.' };
      res.status(400).json(errorResponse);
      return;
    }

    const successResponse: ApiResponse = { status: 'success', data: googleSheetId };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    next(error);
  }
};

export const updateGoogleSheetController = async (req: Request, res: Response, next: NextFunction) => {
  const { googleSheetId: spreadsheetId } = req.params;
  const data = req.body;
  const auth = req.oauth2Client;

  try {
    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

    await updateGoogleSheetDataService(sheets, spreadsheetId, data);

    res.status(200).json({ message: 'Google Sheet updated successfully.' });
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    next(error);
  }
};
