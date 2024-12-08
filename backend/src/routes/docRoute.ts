import express from 'express';
import { createDocController, getDocByIdController } from '../controllers/docControllers';

const router = express.Router();

router.get('/:docId', getDocByIdController);
router.post('/', createDocController);

export default router;
