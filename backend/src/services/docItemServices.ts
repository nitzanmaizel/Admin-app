import DocItemModel from '../models/DocItemModal';
import DocModel from '../models/DocModal';
import { IDocItemData } from '../types/DocItemTypes';

const excludedFields = '-updatedAt -createdAt -updatedAt -__v';

interface CreateDocItemServiceProps {
  docId: string;
  itemDataModalId: string;
  userAdditionalData?: { key: string; value: string }[];
}

/**
 * Service to create a new AppSheet item.
 *
 * @param {string} docId - The ID of the doc.
 * @param {string} itemDataModalId - The ID of the doc item.
 * @param {{ key: string; value: string }[]} userAdditionalData - The additional data for the item.
 * @returns {Promise<IDocItemData>} - The created AppSheet item data.
 */
export const createDocItemService = async ({
  docId,
  itemDataModalId,
  userAdditionalData,
}: CreateDocItemServiceProps): Promise<IDocItemData> => {
  const doc = await DocModel.findById(docId).exec();

  if (!doc) {
    throw new Error(`Doc not found for ID: ${docId}`);
  }

  const additionalData = userAdditionalData ? userAdditionalData : doc.additionalData;

  const docItem = new DocItemModel({ docId, databaseModel: doc.databaseModel, data: itemDataModalId, itemDataModalId, additionalData });

  const savedDocItem = await docItem.save();

  return savedDocItem;
};

/**
 * Service to delete multiple Doc items.
 *
 * @param {string} docId - The ID of the AppSheet.
 * @param {string[]} itemDocIds - The IDs of the AppSheet items to delete.
 * @returns {Promise<{ message: string; deletedCount: number }>} - The deleted sheet item data.
 */
export const deleteDocItemsService = async (docId: string, itemDocIds: string[]): Promise<string> => {
  const deleteResult = await DocItemModel.deleteMany({ _id: { $in: itemDocIds }, docId }).exec();

  return `Delete Doc Items: {${deleteResult.deletedCount}} items deleted successfully`;
};

/**
 * Service to update an existing AppSheet item.
 *
 * @param {string} docId - The ID of the Doc.
 * @param {string} docItemId - The ID of the Doc item.
 * @param {{ key: string; value: string }[]} additionalData - The additional data to update.
 * @returns {Promise<IDocItemData>} - The updated sheet item data or null if not found.
 */
export const updateDocItemService = async (
  docId: string,
  docItemId: string,
  additionalData: { key: string; value: string }[]
): Promise<IDocItemData> => {
  const updatedItem = await DocItemModel.findOneAndUpdate({ _id: docItemId, docId }, { additionalData: additionalData }, { new: true })
    .populate('data', excludedFields)
    .exec();
  if (!updatedItem) {
    throw new Error(`Doc item not found for ID: ${docItemId}`);
  }

  return updatedItem;
};

/**
 * Service to update multiple doc items with the same additional data changes.
 *
 * @param {string} docId - The ID of the Doc.
 * @param {string[]} docItemIds - An array of Doc Item IDs to update.
 * @param {{ key: string; value: string }[]} additionalData - The additional data to apply to each doc item.
 * @returns {Promise<{ updatedItems: IDocItemData[], failedItems: string[] }>}
 *   A promise that resolves to an object containing:
 *   - updatedItems: An array of successfully updated doc items.
 *   - failedItems: An array of doc item IDs that could not be updated.
 * @throws {Error} If an error occurs during the update process.
 */
export const bulkUpdateDocItemsService = async (
  docId: string,
  docItemIds: string[],
  additionalData: { key: string; value: string }[]
): Promise<{ updatedItems: IDocItemData[]; failedItems: string[] }> => {
  const updatedItems: IDocItemData[] = [];
  const failedItems: string[] = [];

  for (const docItemId of docItemIds) {
    try {
      const updatedItem = await DocItemModel.findOneAndUpdate({ _id: docItemId, docId }, { additionalData }, { new: true });
      if (!updatedItem) {
        failedItems.push(docItemId);
      } else {
        updatedItems.push(updatedItem);
      }
    } catch (error) {
      console.error(`Error updating doc item ${docItemId}:`, error);
      failedItems.push(docItemId);
    }
  }

  return { updatedItems, failedItems };
};
