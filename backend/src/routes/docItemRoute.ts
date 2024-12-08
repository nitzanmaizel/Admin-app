import express from 'express';
import {
  bulkUpdateDocItemsController,
  createDocItemController,
  deleteDocItemsController,
  updateDocItemController,
} from '../controllers/docItemControllers';

const router = express.Router();

router.delete('/:docId', deleteDocItemsController);
router.post('/:docId', createDocItemController);
router.put('/:docId/bulk-update', bulkUpdateDocItemsController);
router.put('/:docId/:docItemId', updateDocItemController);

export default router;
