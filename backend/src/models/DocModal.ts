import { Schema, model } from 'mongoose';
import { IDocDataDocument } from '../types/DocTypes';

const keyValuePairSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ColumnSchema = new Schema(
  {
    field: { type: String, required: true },
    headerName: { type: String, required: true },
    flex: { type: Number, required: true },
  },
  { _id: false }
);

const docSchema = new Schema<IDocDataDocument>(
  {
    docId: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    databaseModel: { type: String, required: true },
    additionalData: { type: [keyValuePairSchema], default: [] },
    columns: { type: [ColumnSchema], default: [] },
  },
  { timestamps: true }
);

docSchema.index({ title: 1 });

const DocModel = model<IDocDataDocument>('docs', docSchema);
export default DocModel;
