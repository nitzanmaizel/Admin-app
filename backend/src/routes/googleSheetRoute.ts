import express from 'express';
import {
  createGoogleSheetController,
  downloadGoogleSheetController,
  loadGoogleSheetController,
  updateGoogleSheetController,
} from '../controllers/googleSheetController';

const router = express.Router();

router.get('/:googleSheetId/load', loadGoogleSheetController);
router.put('/:googleSheetId/update', updateGoogleSheetController);
router.get('/:googleSheetId/download', downloadGoogleSheetController);
router.get('/:docId', createGoogleSheetController);

export default router;
