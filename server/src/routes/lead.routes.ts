import express from 'express';

import {
  createLead,
  deleteLead,
  exportCSV,
  getLeads,
  updateLead,
} from '../controllers/lead.controller';

import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/role.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete("/:id", protect, deleteLead);
router.get('/export/csv', exportCSV);

export default router;