import express from 'express';
import { getAllAdminUsersController, createAdminUserController } from '../controllers/adminUsersControllers';

const router = express.Router();

router.get('/', getAllAdminUsersController);

router.post('/:personalNumber', createAdminUserController);

export default router;
