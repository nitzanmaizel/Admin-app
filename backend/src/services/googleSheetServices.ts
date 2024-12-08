import { google, sheets_v4 } from 'googleapis';
import { handleError } from '../utils/errorHandler';
import { Model } from 'mongoose';
import { applyGoogleSheetStyles } from '../utils/googleSheetUtils';
import { HeaderMap } from '../types/SoldierItemTypes';

/**
 * Service to get data from a specific tab (sheet) in a Google Sheet.
 * @param {string} sheetId - The ID of the Google Sheet.
 * @param {string} sheetTabName - The name of the specific sheet tab.
 * @param {any} auth - The OAuth2 client for authentication.
 * @returns {Promise<any[]>} - A promise that resolves to the tab data (rows).
 */
export const getGoogleSheetService = async (sheetId: string, sheetTabName: string, auth: any): Promise<any> => {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetTabName,
    });
    return response.data.values || [];
  } catch (error) {
    const errorMessage = handleError(error);
    console.error('Error retrieving sheet tab data:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const loadGoogleSheetToDB = async <T>(googleSheetData: string[][], model: Model<T>, headerMap: HeaderMap<T>): Promise<void> => {
  if (googleSheetData.length === 0) {
    throw new Error('Google Sheet data is empty.');
  }

  const [headerRow, ...dataRows] = googleSheetData;

  console.log('headerRow:', headerRow);

  const headerIndices: (keyof T | undefined)[] = headerRow.map((header: string) => {
    return headerMap[header];
  });

  const items: Partial<T>[] = dataRows.map((row) => {
    const itemData: Partial<T> = {};
    row.forEach((cell: string, index: number) => {
      const key = headerIndices[index];
      if (key) {
        itemData[key] = cell as any;
      }
    });
    return itemData;
  });

  console.log({ items });

  try {
    await model.insertMany(items);
  } catch (error) {
    const errorMessage = handleError(error);
    console.error('Error retrieving sheet tab data:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Service to create a new Google Sheet and populate it with data.
 * @param {string} sheetTitle - The title of the new Google Sheet.
 * @param {string[][]} data - The data to populate in the sheet (array of arrays).
 * @param {any} auth - The OAuth2 client for authentication.
 * @returns {Promise<string>} - A promise that resolves to the created sheet URL.
 */
export const createGoogleSheetService = async (sheetTitle: string, data: string[][], auth: any): Promise<string> => {
  const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

  try {
    const { spreadsheetId, sheetId } = await createDefaultGoogleSheet(sheets, sheetTitle);
    await updateGoogleSheetDataService(sheets, spreadsheetId, data);
    await applyGoogleSheetStyles(sheets, spreadsheetId, sheetId, data);

    return spreadsheetId;
  } catch (error) {
    const errorMessage = handleError(error);
    console.error('Error creating and populating sheet:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Updates the Google Sheet with the provided data.
 * @param sheets - Google Sheets API instance.
 * @param spreadsheetId - The ID of the spreadsheet.
 * @param data - Data to populate in the sheet.
 */
export async function updateGoogleSheetDataService(sheets: sheets_v4.Sheets, spreadsheetId: string, data: string[][]): Promise<void> {
  const requestBody = { values: data };

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Sheet1',
    valueInputOption: 'RAW',
    requestBody,
  });
}

/**
 * Creates a new Google Sheet with the given title.
 * @param sheets - Google Sheets API instance.
 * @param sheetTitle - Title for the new sheet.
 * @returns {Promise<{spreadsheetId: string, sheetId: number}>} - The spreadsheet and sheet IDs.
 */
async function createDefaultGoogleSheet(sheets: sheets_v4.Sheets, sheetTitle: string): Promise<{ spreadsheetId: string; sheetId: number }> {
  const sheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: sheetTitle,
        defaultFormat: {
          horizontalAlignment: 'RIGHT',
          textDirection: 'RIGHT_TO_LEFT',
        },
      },
      sheets: [{ properties: { title: 'Sheet1', rightToLeft: true } }],
    },
  });

  const spreadsheetId = sheet.data.spreadsheetId;
  const sheetId = sheet.data.sheets?.[0]?.properties?.sheetId || 0;

  if (!spreadsheetId || !sheetId) {
    throw new Error('No spreadsheet ID or sheet ID found.');
  }

  return { spreadsheetId, sheetId };
}
