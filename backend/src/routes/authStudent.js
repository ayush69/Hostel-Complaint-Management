const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const router = express.Router();
router.post('/register',
  body('name').isLength({min:2}),
  body('email').isEmail(),
  body('password').isLength({min:6}),
  body('rollNo').notEmpty(),
  async (req,res)=>{
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    try {
      const { name,email,password,rollNo,branch,phoneNumber,roomNo,year } = req.body;
      let exists = await Student.findOne({ $or: [{email},{rollNo}] });
      if (exists) return res.status(400).json({message:'Student with email or rollNo already exists'});
      const hashed = await hashPassword(password);
      const student = await Student.create({ name,email,password:hashed,rollNo,branch,phoneNumber,roomNo,year });
  const token = generateToken({ id: student._id, role: 'student', name: student.name });
  res.json({ token, user: { id: student._id, name: student.name, email: student.email } });
    } catch (err) { console.error(err); res.status(500).json({message:'Server error'}); }
  }
);
router.post('/login', body('email').isEmail(), body('password').isLength({min:6}), async (req,res)=>{
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  try {
    const { email,password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({message:'Invalid credentials'});
    const ok = await comparePassword(password, student.password);
    if (!ok) return res.status(400).json({message:'Invalid credentials'});
    const token = generateToken({ id: student._id, role: 'student', name: student.name });
    res.json({ token, user: { id: student._id, name: student.name, email: student.email } });
  } catch (err) { console.error(err); res.status(500).json({message:'Server error'}); }
});
module.exports = router;
