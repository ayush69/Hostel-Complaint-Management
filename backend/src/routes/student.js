import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Complaint from '../models/Complaint.js';
import Fine from '../models/Fine.js';

const router = express.Router();

router.get('/dashboard', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'student') return res.status(403).json({message:'Student only'});
  try {
    const studentId = req.user.id;
    const total = await Complaint.countDocuments({ studentId });
    const pending = await Complaint.countDocuments({ studentId, status: 'Pending' });
    const completed = await Complaint.countDocuments({ studentId, status: 'Completed' });
    const fines = await Fine.find({ studentId });
    const unpaid = fines.filter(f=>f.status==='Unpaid').reduce((s,f)=>s+f.amount,0);
    res.json({ total, pending, completed, unpaid });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

router.get('/fines', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'student') return res.status(403).json({message:'Student only'});
  try {
    const fines = await Fine.find({ studentId: req.user.id }).populate('imposedBy','name').sort({createdAt:-1});
    res.json({ fines });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

export default router;
