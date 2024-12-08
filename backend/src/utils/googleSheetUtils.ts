import { sheets_v4 } from 'googleapis';
import { IDocItemData } from '../types/DocItemTypes';
import { Document, Types } from 'mongoose';

export function transformDocItemsToSheetData(docItems: IDocItemData[]): string[][] {
  const keySet = new Set<string>();

  // Collect all unique keys from 'data' and 'additionalData'
  docItems.forEach((item) => {
    // Initialize 'dataObj' as an empty object
    let dataObj: { [key: string]: string } = {};

    // Check if 'item.data' exists and is not a Types.ObjectId
    if (item.data && !(item.data instanceof Types.ObjectId)) {
      if (item.data instanceof Document) {
        // If 'item.data' is a Mongoose document, convert it to a plain object
        if (typeof (item.data as any).toObject === 'function') {
          dataObj = (item.data as any).toObject();
        }
      } else if (typeof item.data === 'object' && !Array.isArray(item.data)) {
        // If 'item.data' is a plain object
        dataObj = item.data as { [key: string]: string };
      } else {
        // Handle other types (e.g., arrays)
        console.warn(`Unexpected data type for item.data: ${typeof item.data}`);
        // You may choose to handle arrays differently or skip them
      }

      // Collect keys from 'dataObj'
      Object.keys(dataObj).forEach((key) => keySet.add(key));
    } else {
      // Handle cases where 'item.data' is missing or is an ObjectId
      console.warn('item.data is missing or is a Types.ObjectId');
    }

    // Collect keys from 'additionalData' array
    item.additionalData.forEach(({ key }) => keySet.add(key));
  });

  // Convert the set of keys to an array to serve as headers
  const headers = Array.from(keySet);

  // Initialize the result array with headers
  const rows: string[][] = [];
  rows.push(headers);

  // Construct each row of values
  docItems.forEach((item) => {
    const row: string[] = [];

    // Prepare 'dataObj' as before
    let dataObj: { [key: string]: unknown } = {};

    if (item.data && !(item.data instanceof Types.ObjectId)) {
      if (item.data instanceof Document && typeof item.data.toObject === 'function') {
        dataObj = item.data.toObject();
      } else if (typeof item.data === 'object' && !Array.isArray(item.data)) {
        dataObj = item.data as { [key: string]: unknown };
      }
    }

    // Create a map from 'additionalData' for quick access
    const additionalDataMap: { [key: string]: string } = {};
    item.additionalData.forEach(({ key, value }) => {
      additionalDataMap[key] = value;
    });

    // For each header, get the corresponding value
    headers.forEach((key) => {
      let value = '';

      if (dataObj.hasOwnProperty(key)) {
        // If the key exists in the 'data' object
        value = String(dataObj[key]);
      } else if (additionalDataMap.hasOwnProperty(key)) {
        // If the key exists in 'additionalData'
        value = additionalDataMap[key];
      }

      // If the key doesn't exist in either, value remains an empty string
      row.push(value);
    });

    // Add the row to the result array
    rows.push(row);
  });

  return rows;
}

export function transformDocItemsToGoogleSheet(docItems: IDocItemData[], headerMapper: { [key: string]: string }): string[][] {
  if (docItems.length === 0) return [];

  const firstItem = docItems[0];
  const dataKeys = typeof firstItem.data === 'object' ? Object.keys(firstItem.data) : [];
  const additionalDataKeys = firstItem.additionalData.map((item) => item.key);

  // Combine keys from both data and additionalData
  const headerKeys = [...dataKeys, ...additionalDataKeys];

  // Apply headerMapper to transform the header keys
  const mappedHeaderKeys = headerKeys.map((key) => headerMapper[key] || key);

  // Map the rows, maintaining original values for each item
  const rows = docItems.map((item) => {
    const dataValues = typeof item.data === 'object' ? Object.values(item.data) : [];
    const additionalDataValues = item.additionalData.map((item) => item.value);
    return [...dataValues, ...additionalDataValues];
  });

  // Return the header row and the data rows
  return [mappedHeaderKeys, ...rows];
}

/**
 * Reusable function to generate cell update requests for Google Sheets.
 * @param sheetId - The ID of the sheet.
 * @param startRowIndex - The starting row index for the range.
 * @param endRowIndex - The ending row index for the range.
 * @param data - The data for the range to update.
 * @param userEnteredFormat - The style to apply.
 * @param fields - The fields to update.
 * @returns The update request object for the batch update.
 */
export function generateUpdateCellsRequest(
  sheetId: number,
  startRowIndex: number,
  endRowIndex: number,
  data: string[][],
  styles: { userEnteredFormat: sheets_v4.Schema$CellFormat; fields: string }
) {
  const { userEnteredFormat, fields } = styles;
  return {
    updateCells: {
      range: {
        sheetId,
        startRowIndex,
        endRowIndex,
        startColumnIndex: 0,
        endColumnIndex: data[0].length,
      },
      rows: data.map((row) => ({
        values: row.map((cell) => ({
          userEnteredFormat,
          userEnteredValue: { stringValue: cell },
        })),
      })),
      fields,
    },
  };
}

/**
 * Applies styles to the Google Sheet, including the first row and remaining rows.
 * @param sheets - Google Sheets API instance.
 * @param spreadsheetId - The ID of the spreadsheet.
 * @param sheetId - The ID of the sheet.
 * @param data - The data to apply the styles to.
 */
export async function applyGoogleSheetStyles(sheets: sheets_v4.Sheets, spreadsheetId: string, sheetId: number, data: string[][]) {
  const requests = [];

  requests.push(generateUpdateCellsRequest(sheetId, 0, 1, data.slice(0, 1), googleSheetHeaderStyles));

  requests.push(generateUpdateCellsRequest(sheetId, 1, data.length, data.slice(1), googleSheetRowStyles));

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests },
  });
}

const googleSheetRowStyles = {
  userEnteredFormat: {
    textFormat: { fontSize: 11 },
    textDirection: 'RIGHT_TO_LEFT',
    horizontalAlignment: 'RIGHT',
    borders: {
      top: { style: 'SOLID', color: { red: 0, green: 0, blue: 0 } },
      bottom: { style: 'SOLID', color: { red: 0, green: 0, blue: 0 } },
      left: { style: 'SOLID', color: { red: 0, green: 0, blue: 0 } },
      right: { style: 'SOLID', color: { red: 0, green: 0, blue: 0 } },
    },
  },
  fields: 'userEnteredFormat(textFormat,borders,horizontalAlignment,textDirection)',
};

const googleSheetHeaderStyles = {
  userEnteredFormat: {
    backgroundColor: { blue: 0.827451, green: 0.91764706, red: 0.8509804 },
    textFormat: { fontSize: 11, bold: true },
    textDirection: 'LEFT_TO_RIGHT',
    horizontalAlignment: 'RIGHT',
    borders: {
      top: { style: 'SOLID', color: { red: 0, green: 0, blue: 0 } },
      bottom: { style: 'SOLID', color: { red: 0, green: 0, blue: 0 } },
      left: { style: 'SOLID', color: { red: 0, green: 0, blue: 0 } },
      right: { style: 'SOLID', color: { red: 0, green: 0, blue: 0 } },
    },
  },
  fields: 'userEnteredFormat(backgroundColor,textFormat,borders,horizontalAlignment,textDirection)',
};
