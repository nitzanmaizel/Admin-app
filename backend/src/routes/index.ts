import { Router } from 'express';
import authRoute from './authRoute';
import googleSheetRoute from './googleSheetRoute';
import adminUsersRoute from './adminUsersRoute';
import docRouter from './docRoute';
import docItemRouter from './docItemRoute';
import { authenticateJWT, refreshTokenMiddleware } from '../middleware';

const router = Router();

router.use('/auth', authRoute);

router.use(authenticateJWT, refreshTokenMiddleware);

router.use('/admin-user', adminUsersRoute);
router.use('/google-sheet', googleSheetRoute);
router.use('/doc', docRouter);
router.use('/doc-item', docItemRouter);

export default router;
