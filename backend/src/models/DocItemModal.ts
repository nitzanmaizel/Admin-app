import { Schema, model } from 'mongoose';
import { IDocItemDataDocument } from '../types/DocItemTypes';

const additionalDataSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const docItemSchema = new Schema<IDocItemDataDocument>(
  {
    docId: { type: String, required: true },
    databaseModel: { type: String, required: true },
    databaseDocId: { type: String, refPath: 'databaseModel', required: true },
    data: { type: Schema.Types.ObjectId, refPath: 'databaseModel', default: null },
    additionalData: { type: [additionalDataSchema], default: [] },
  },
  { timestamps: true }
);

/**
 * Compound index on appSheetId and itemId.
 * - Ensures that each user has only one SheetData document per sheet.
 * - Optimizes queries that filter by appSheetId and itemId.
 */
docItemSchema.index({ docId: 1, databaseDocId: 1 }, { unique: true });

/**
 * Index on appSheetId.
 * - Optimizes queries that retrieve all SheetData for a specific sheet.
 */
docItemSchema.index({ docId: 1 });

docItemSchema.virtual('docItemId').get(function () {
  return this._id.toString();
});

docItemSchema.set('toObject', { virtuals: true });
docItemSchema.set('toJSON', { virtuals: true });

const DocItemModel = model<IDocItemDataDocument>('doc-item', docItemSchema);
export default DocItemModel;
