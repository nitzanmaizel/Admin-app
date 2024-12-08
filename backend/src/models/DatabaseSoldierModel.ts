import { Schema, model, Model } from 'mongoose';
import { ISoldierDataDocument } from '../types/SoldierItemTypes';

const soldierDataSchema = new Schema<ISoldierDataDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    personalNumber: { type: String, unique: true, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    equipment: { type: String },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

soldierDataSchema.virtual('databaseItemId').get(function () {
  return this._id.toString();
});

soldierDataSchema.set('toObject', { virtuals: true });
soldierDataSchema.set('toJSON', { virtuals: true });

const DatabaseSoldierModel: Model<ISoldierDataDocument> = model<ISoldierDataDocument>('database-soldiers', soldierDataSchema);
export default DatabaseSoldierModel;
