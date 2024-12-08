import { Types } from 'mongoose';
import { IDocItemData } from './DocItemTypes';

export interface IDocData {
  docId: string;
  title: string;
  description: string;
  databaseModel: string;
  docItems?: IDocItemData[];
  additionalData?: { key: string; value: string }[];
  columns: { field: string; headerName: string; flex: number }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDocDataDocument extends IDocData, Document {
  _id: Types.ObjectId;
}
