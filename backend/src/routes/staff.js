const express = require('express');
const Complaint = require('../models/Complaint');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
router.get('/assigned-complaints', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'staff') return res.status(403).json({message:'Staff only'});
  const status = req.query.status;
  const filter = { assignedStaffId: req.user.id };
  if (status) filter.status = status;
  const list = await Complaint.find(filter).sort({createdAt:-1});
  res.json({ list });
});
router.put('/complaints/:id/update-status', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'staff') return res.status(403).json({message:'Staff only'});
  const { status } = req.body; const c = await Complaint.findById(req.params.id);
  if (!c) return res.status(404).json({message:'Not found'});
  if (String(c.assignedStaffId) !== String(req.user.id)) return res.status(403).json({message:'Not assigned to you'});
  c.status = status; if (status === 'InProgress') c.assignedDate = c.assignedDate || new Date(); if (status === 'Completed') c.completedDate = new Date();
  await c.save(); res.json({ complaint: c });
});
module.exports = router;
