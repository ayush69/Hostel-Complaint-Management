const express = require('express');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
router.post('/raise', authenticate,
  body('title').isLength({min:3}),
  body('category').isIn(['Electrician','Plumber','Carpenter','Cleaner','Maintenance','Other']),
  async (req,res)=>{
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const { title,description,category,isAnonymous,roomNo } = req.body;
    const studentId = req.user.id;
    const studentName = isAnonymous ? 'Anonymous' : req.user.name || '';
    const complaint = await Complaint.create({ title, description, category, isAnonymous: !!isAnonymous, studentId, studentName, roomNo, status:'Pending' });
    res.json({ complaint });
  }
);
router.get('/student/history', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'student') return res.status(403).json({message:'Student only'});
  const list = await Complaint.find({ studentId: req.user.id }).populate('assignedStaffId','name category phoneNumber').sort({createdAt:-1});
  res.json({ list });
});
router.get('/:id/details', authenticate, async (req,res)=>{
  const c = await Complaint.findById(req.params.id).populate('assignedStaffId','name category phoneNumber');
  if (!c) return res.status(404).json({message:'Not found'});
  res.json({ complaint: c });
});
router.put('/:id/rate', authenticate, body('rating').isInt({min:1,max:5}), async (req,res)=>{
  if (!req.user || req.user.role !== 'student') return res.status(403).json({message:'Student only'});
  const { rating, feedback } = req.body;
  const c = await Complaint.findById(req.params.id);
  if (!c) return res.status(404).json({message:'Not found'});
  if (String(c.studentId) !== String(req.user.id)) return res.status(403).json({message:'Not allowed'});
  if (c.status !== 'Completed') return res.status(400).json({message:'Complaint not completed'});
  c.rating = rating; c.feedback = feedback || '';
  await c.save();
  res.json({ complaint: c });
});
module.exports = router;
