import { Types } from 'mongoose';

export interface IDocItemData {
  docId: string;
  docItemId?: string;
  databaseDocId: string;
  databaseModel: string;
  data: Types.ObjectId | { [k: string]: unknown };
  additionalData: { key: string; value: string }[];
}

export interface IDocItemDataDocument extends IDocItemData, Document {
  _id: Types.ObjectId;
}

export interface BulkUpdateData {
  docItemId: string;
  additionalData: { key: string; value: string }[];
}
