import { Types } from 'mongoose';

export interface ISoldierData {
  firstName: string;
  lastName: string;
  personalNumber: string;
  phone: string;
  company: string;
  department: string;
  equipment?: string;
  notes?: string;
}

export interface ISoldierDataDocument extends ISoldierData, Document {
  _id: Types.ObjectId;
}

export type HeaderMap<T> = {
  [header: string]: keyof T;
};

export const headerSoldierMap: HeaderMap<ISoldierData> = {
  'שם משפחה': 'lastName',
  'שם פרטי': 'firstName',
  'מספר אישי': 'personalNumber',
  פלוגה: 'company',
  מחלקה: 'department',
  'פק"ל': 'equipment',
  טלפון: 'phone',
  הערות: 'notes',
};

export const GoogleSheetSoldierMap = {
  lastName: 'שם משפחה',
  firstName: 'שם פרטי',
  personalNumber: 'מספר אישי',
  company: 'פלוגה',
  department: 'מחלקה',
  equipment: 'פק"ל',
  phone: 'טלפון',
  notes: 'הערות',
};
