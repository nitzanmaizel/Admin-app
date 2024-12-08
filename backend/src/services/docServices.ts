import DocItemModel from '../models/DocItemModal';
import DocModel from '../models/DocModal';
import { IDocData } from '../types/DocTypes';
import { IDocItemData } from '../types/DocItemTypes';
import { Model } from 'mongoose';

const excludedFields = '-updatedAt -createdAt -updatedAt -__v -_ac -_ct -role -picture';

const keysOrderConfig = [
  { field: 'lastName', headerName: 'שם משפחה', flex: 1 },
  { field: 'firstName', headerName: 'שם פרטי', flex: 1 },
  { field: 'personalNumber', headerName: 'מספר אישי', flex: 1 },
  { field: 'phone', headerName: 'טלפון', flex: 1 },
  { field: 'company', headerName: 'פלוגה', flex: 1 },
  { field: 'department', headerName: 'מחלקה', flex: 1 },
  { field: 'equipment', headerName: 'פק"ל', flex: 1 },
  { field: 'notes', headerName: 'הערות', flex: 1 },
];

/**
 * Service to create a new AppSheet.
 *
 * @template T
 * @param {IDocData} tempDocData - The data for the new AppSheet.
 * @param {Model<T>} model - The Mongoose model to use for fetching items.
 * @returns {Promise<IDocData>} - The created AppSheet.
 * @throws {Error} - If no items are found for the specified type.
 */
export const createDocService = async <T>(tempDocData: IDocData, model: Model<T>): Promise<IDocData> => {
  const newDoc = new DocModel(tempDocData);

  const items = await model.find().select(excludedFields).lean().exec();

  if (items.length === 0) {
    throw new Error(`No items found for ${tempDocData.databaseModel}`);
  }

  const columns = keysOrderConfig.map(({ field, headerName }) => ({ field: field, headerName: headerName || field, flex: 1 }));

  newDoc.docId = newDoc._id.toString();
  newDoc.columns = columns;

  await newDoc.save();

  const docItemsArray: IDocItemData[] = items.map((item) => ({
    docId: newDoc.docId,
    databaseModel: tempDocData.databaseModel,
    databaseDocId: (item as any)._id.toString(),
    data: item,
    additionalData: tempDocData.additionalData || [],
  }));

  await DocItemModel.insertMany(docItemsArray);

  return newDoc;
};

/**
 * Service to fetch all data entries for a specific AppSheet.
 *
 * @param {string} docId - The ID of the AppSheet.
 * @returns {Promise<Object>} - An object containing AppSheet details and its items.
 * @throws {Error} - If the AppSheet is not found.
 */
export const getDocByIdService = async (docId: string): Promise<IDocData> => {
  const docData = await DocModel.findById(docId).lean().exec();

  if (!docData) {
    throw new Error('Doc not found');
  }

  const docItems = (await DocItemModel.find({ docId }).populate('data', excludedFields).exec()) as IDocItemData[];

  if (docItems.length === 0) {
    throw new Error('No items found for doc');
  }

  return {
    ...docData,
    docItems,
  };
};
