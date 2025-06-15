import express from 'express';
import { createComplaint } from '../controllers/complaint.controller.js';

const router = express.Router();

// POST /api/complaints - Create a new complaint
router.post('/', createComplaint);

export default router;