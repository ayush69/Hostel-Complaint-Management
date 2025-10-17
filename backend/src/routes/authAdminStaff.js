const express = require('express');
const { body, validationResult } = require('express-validator');
const Staff = require('../models/Staff');
const Admin = require('../models/Admin');
const { comparePassword, hashPassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
router.post('/staff/login', body('email').isEmail(), body('password').isLength({min:6}), async (req,res)=>{
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const { email,password } = req.body;
  const staff = await Staff.findOne({ email });
  if (!staff) return res.status(400).json({message:'Invalid credentials'});
  const ok = await comparePassword(password, staff.password);
  if (!ok) return res.status(400).json({message:'Invalid credentials'});
  const token = generateToken({ id: staff._id, role: 'staff', name: staff.name });
  res.json({ token, user: { id: staff._id, name: staff.name, category: staff.category } });
});
router.post('/admin/login', body('email').isEmail(), body('password').isLength({min:6}), async (req,res)=>{
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const { email,password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({message:'Invalid credentials'});
  const ok = await comparePassword(password, admin.password);
  if (!ok) return res.status(400).json({message:'Invalid credentials'});
  const token = generateToken({ id: admin._id, role: 'admin', name: admin.name });
  res.json({ token, user: { id: admin._id, name: admin.name, role: admin.role } });
});
// create staff
router.post('/admin/create-staff', authenticate, body('name').isLength({min:2}), body('email').isEmail(), body('password').isLength({min:6}), async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const { name,email,password,category,phoneNumber,address,offDay } = req.body;
  let exists = await Staff.findOne({ email }); if (exists) return res.status(400).json({message:'Staff exists'});
  const hashed = await hashPassword(password);
  const s = await Staff.create({ name,email,password:hashed,category,phoneNumber,address,offDay });
  res.json({ staff: s });
});
module.exports = router;
