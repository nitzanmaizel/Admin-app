import { Document, Types } from 'mongoose';

export type AdminUserRole = 'user' | 'moderator' | 'admin';

export interface IAdminUser {
  userId?: string;
  firstName: string;
  lastName: string;
  personalNumber: string;
  phone: string;
  company: string;
  department: string;
  status: string;
  notes?: string;
  email?: string;
  equipment?: string;
  picture?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiryDate?: Date;
  role: AdminUserRole;
}

export interface IAdminUserDocument extends IAdminUser, Document {
  _id: Types.ObjectId;
}
