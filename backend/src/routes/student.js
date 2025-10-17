const express = require('express');
const { authenticate } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const Fine = require('../models/Fine');
const router = express.Router();
router.get('/dashboard', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'student') return res.status(403).json({message:'Student only'});
  const studentId = req.user.id;
  const total = await Complaint.countDocuments({ studentId });
  const pending = await Complaint.countDocuments({ studentId, status: 'Pending' });
  const completed = await Complaint.countDocuments({ studentId, status: 'Completed' });
  const fines = await Fine.find({ studentId });
  const unpaid = fines.filter(f=>f.status==='Unpaid').reduce((s,f)=>s+f.amount,0);
  res.json({ total, pending, completed, unpaid });
});
router.get('/fines', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'student') return res.status(403).json({message:'Student only'});
  const fines = await Fine.find({ studentId: req.user.id }).populate('imposedBy','name');
  res.json({ fines });
});
module.exports = router;
