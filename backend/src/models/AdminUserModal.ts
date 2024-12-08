import { Schema, model } from 'mongoose';
import encrypt from 'mongoose-encryption';
import { IAdminUserDocument } from '../types/AdminUserTypes';

const userSchema = new Schema<IAdminUserDocument>(
  {
    userId: { type: String, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    personalNumber: { type: String, unique: true, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    equipment: { type: String },
    notes: { type: String },
    email: { type: String, lowercase: true, trim: true, required: true, unique: true },
    picture: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiryDate: { type: Date },
    role: { type: String, default: 'moderator' },
  },
  { timestamps: true },
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $type: 'string', $exists: true, $ne: null } },
  },
);

const encKey = process.env.ENC_KEY;
const sigKey = process.env.SIG_KEY;

if (!encKey || !sigKey) {
  throw new Error('Encryption keys (ENC_KEY and SIG_KEY) must be set in environment variables.');
}

const encKeyBuffer = Buffer.from(encKey, 'base64');
const sigKeyBuffer = Buffer.from(sigKey, 'base64');

if (encKeyBuffer.length !== 32) {
  throw new Error('ENC_KEY must be 32 bytes after base64 decoding.');
}
if (sigKeyBuffer.length !== 64) {
  throw new Error('SIG_KEY must be 64 bytes after base64 decoding.');
}

userSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ['accessToken', 'refreshToken'],
  requireAuthenticationCode: false,
});

const AdminUserModal = model<IAdminUserDocument>('admin-users', userSchema);
export default AdminUserModal;
