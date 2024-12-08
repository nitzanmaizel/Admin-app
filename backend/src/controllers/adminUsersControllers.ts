import { Request, Response, NextFunction } from 'express';
import AdminUserModal from '../models/AdminUserModal';
import DatabaseSoldierModel from '../models/DatabaseSoldierModel';

const excludeFields =
  '-accessToken -refreshToken -tokenExpiryDate -updatedAt -createdAt -updatedAt -__v -_ac -_ct -userId -fullName -equipment -picture';

export const getAllAdminUsersController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  const adminUsers = await AdminUserModal.find().select(excludeFields).lean();

  try {
    res.status(201).json(adminUsers);
  } catch (error) {
    console.error('Error getAllAdminUsersController:', error);
    next(error);
  }
};

export const createAdminUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { personalNumber } = req.params;
    const { email } = req.body;

    if (!personalNumber || !email) {
      res.status(400).json({ message: 'Personal number is required' });
      return;
    }

    const existingUser = await DatabaseSoldierModel.findOne({ personalNumber }).select(`${excludeFields} -_id`).lean();

    if (!existingUser) {
      res.status(400).json({ message: 'Soldier not found' });
      return;
    }

    const adminUserRaw = { ...existingUser, email };

    const adminUser = new AdminUserModal(adminUserRaw);

    await adminUser.save();
    res.status(201).json(adminUser);
  } catch (error) {
    console.error('Error createAdminUserController:', error);
    next(error);
  }
  console.log('Creating admin user...');
};
