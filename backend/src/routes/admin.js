const express = require('express');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const Fine = require('../models/Fine');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Admin Dashboard Stats
router.get('/dashboard', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  try {
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const totalComplaints = await Complaint.countDocuments({});
    const totalStudents = await Student.countDocuments({});
    const totalStaff = await Staff.countDocuments({ deleted: { $ne: true } });
    const assignedComplaints = await Complaint.countDocuments({ status: 'Assigned' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'InProgress' });
    const completedComplaints = await Complaint.countDocuments({ status: 'Completed' });
    
    res.json({ 
      pendingComplaints,
      totalComplaints,
      totalStudents,
      totalStaff,
      assignedComplaints,
      inProgressComplaints,
      completedComplaints
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

router.get('/complaints/pending', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  const list = await Complaint.find({ status: 'Pending' }).populate('studentId', 'name rollNo roomNo').sort({createdAt:-1});
  res.json({ list });
});
router.put('/complaints/:id/assign', authenticate, body('staffId').notEmpty(), async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  const { staffId } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({message:'Complaint not found'});
  const staff = await Staff.findById(staffId);
  if (!staff) return res.status(400).json({message:'Staff not found'});
  if (staff.category !== complaint.category) return res.status(400).json({message:'Staff category mismatch'});
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = days[new Date().getDay()];
  if (staff.offDay && staff.offDay === today) return res.status(400).json({message:'Staff off today'});
  complaint.assignedStaffId = staff._id; complaint.status = 'Assigned'; complaint.assignedDate = new Date();
  await complaint.save();
  res.json({ complaint });
});

// Reject complaint endpoint
router.put('/complaints/:id/reject', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({message:'Complaint not found'});
    complaint.status = 'Rejected';
    await complaint.save();
    res.json({ complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

router.get('/students', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  try {
    const page = parseInt(req.query.page||'1'); const per = parseInt(req.query.per||'20'); const q = req.query.q || '';
    const filter = q ? { $or: [{ name: new RegExp(q,'i') }, { rollNo: new RegExp(q,'i') }] } : {};
    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter).skip((page-1)*per).limit(per).sort({createdAt:-1});
    
    // Get fine information for each student
    const list = await Promise.all(students.map(async (student) => {
      const fines = await Fine.find({ studentId: student._id });
      const totalFines = fines.length;
      const unpaidFines = fines.filter(f => f.status === 'Unpaid').length;
      const totalUnpaid = fines.filter(f => f.status === 'Unpaid').reduce((sum, f) => sum + f.amount, 0);
      const totalPaid = fines.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
      
      return {
        ...student.toObject(),
        fineStats: {
          totalFines,
          unpaidFines,
          totalUnpaid,
          totalPaid
        }
      };
    }));
    
    res.json({ list, total, page, per });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});
// get one student
router.get('/students/:id', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  const s = await Student.findById(req.params.id);
  if (!s) return res.status(404).json({message:'Student not found'});
  res.json({ student: s });
});
// update student
router.put('/students/:id', authenticate,
  body('name').optional().isLength({min:2}),
  body('email').optional().isEmail(),
  body('rollNo').optional().notEmpty(),
  async (req,res)=>{
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({message:'Student not found'});
    const { name,email,rollNo,branch,phoneNumber,roomNo,year } = req.body;
    // uniqueness checks
    if (email && email !== s.email) {
      const exists = await Student.findOne({ email });
      if (exists && String(exists._id) !== String(s._id)) return res.status(400).json({message:'Email already in use'});
      s.email = email;
    }
    if (rollNo && rollNo !== s.rollNo) {
      const existsR = await Student.findOne({ rollNo });
      if (existsR && String(existsR._id) !== String(s._id)) return res.status(400).json({message:'Roll number already in use'});
      s.rollNo = rollNo;
    }
    if (name) s.name = name;
    if (branch !== undefined) s.branch = branch;
    if (phoneNumber !== undefined) s.phoneNumber = phoneNumber;
    if (roomNo !== undefined) s.roomNo = roomNo;
    if (year !== undefined) s.year = year;
    await s.save();
    res.json({ student: s });
  }
);
router.post('/fines/impose', authenticate, 
  body('studentId').notEmpty(), 
  body('amount').isNumeric().custom(value => {
    if (parseFloat(value) <= 0) {
      throw new Error('Fine amount must be greater than zero');
    }
    return true;
  }), 
  async (req,res)=>{
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    
    try {
      const { studentId, amount, reason } = req.body;
      const student = await Student.findById(studentId);
      if (!student) return res.status(404).json({message:'Student not found'});
      
      const fine = await Fine.create({ 
        studentId: student._id, 
        amount: parseFloat(amount), 
        reason, 
        imposedBy: req.user.id 
      });
      
      student.currentFines.push(fine._id); 
      await student.save();
      res.json({ fine });
    } catch (err) {
      console.error(err);
      res.status(500).json({message:'Server error'});
    }
});

// Get all fines for a student
router.get('/students/:id/fines', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  try {
    const fines = await Fine.find({ studentId: req.params.id })
      .populate('imposedBy', 'name')
      .sort({createdAt: -1});
    res.json({ fines });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

// Reduce fine amount
router.put('/fines/:id/reduce', authenticate,
  body('newAmount').isNumeric().custom(value => {
    if (parseFloat(value) <= 0) {
      throw new Error('Fine amount must be greater than zero');
    }
    return true;
  }),
  async (req,res)=>{
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    
    try {
      const { newAmount } = req.body;
      const fine = await Fine.findById(req.params.id);
      if (!fine) return res.status(404).json({message:'Fine not found'});
      
      if (parseFloat(newAmount) >= fine.amount) {
        return res.status(400).json({message:'New amount must be less than current amount'});
      }
      
      fine.amount = parseFloat(newAmount);
      await fine.save();
      res.json({ fine });
    } catch (err) {
      console.error(err);
      res.status(500).json({message:'Server error'});
    }
});

// Delete fine
router.delete('/fines/:id', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) return res.status(404).json({message:'Fine not found'});
    
    // Remove fine from student's currentFines array
    await Student.updateOne(
      { _id: fine.studentId },
      { $pull: { currentFines: fine._id } }
    );
    
    // Delete the fine
    await Fine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fine deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});
// complaints history for admin
router.get('/complaints', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  const page = parseInt(req.query.page||'1');
  const per = parseInt(req.query.per||'20');
  const status = req.query.status || '';
  const q = req.query.q || '';
  const filter = {};
  if (status) filter.status = status;
  if (q) Object.assign(filter, { $or: [ { title: new RegExp(q,'i') }, { studentName: new RegExp(q,'i') } ] });
  const total = await Complaint.countDocuments(filter);
  const list = await Complaint.find(filter)
    .populate('studentId','name rollNo')
    .populate('assignedStaffId','name category')
    .sort({createdAt:-1})
    .skip((page-1)*per)
    .limit(per);
  res.json({ list, total, page, per });
});
// staff management
router.get('/staff', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  const page = parseInt(req.query.page||'1'); const per = parseInt(req.query.per||'20'); const q = req.query.q || '';
  const category = req.query.category || '';
  const filter = { deleted: { $ne: true } };
  if (q) Object.assign(filter, { $or: [{ name: new RegExp(q,'i') }, { email: new RegExp(q,'i') }] });
  if (category) Object.assign(filter, { category });
  const total = await Staff.countDocuments(filter);
  const list = await Staff.find(filter).skip((page-1)*per).limit(per).sort({createdAt:-1}).lean();
  const staffIds = list.map(s=>s._id);
  const ratingsAgg = await Complaint.aggregate([
    { $match: { assignedStaffId: { $in: staffIds }, rating: { $exists: true, $ne: null } } },
    { $group: { _id: '$assignedStaffId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const rmap = new Map(ratingsAgg.map(r=> [String(r._id), { avg: Math.round(r.avg*10)/10, count: r.count }]));
  const listWith = list.map(s=> ({ ...s, avgRating: (rmap.get(String(s._id))||{}).avg || 0, ratingsCount: (rmap.get(String(s._id))||{}).count || 0 }));
  res.json({ list: listWith, total, page, per });
});
router.get('/staff/:id', authenticate, async (req,res)=>{
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
  const st = await Staff.findById(req.params.id);
  if (!st || st.deleted) return res.status(404).json({message:'Staff not found'});
  res.json({ staff: st });
});
router.put('/staff/:id', authenticate,
  body('email').optional().isEmail(),
  body('name').optional().isLength({min:2}),
  async (req,res)=>{
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({message:'Admin only'});
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const st = await Staff.findById(req.params.id);
    if (!st || st.deleted) return res.status(404).json({message:'Staff not found'});
    const { name,email,category,phoneNumber,address,offDay,deleted } = req.body;
    if (email && email !== st.email) {
      const exists = await Staff.findOne({ email });
      if (exists && String(exists._id) !== String(st._id)) return res.status(400).json({message:'Email already in use'});
      st.email = email;
    }
    if (name) st.name = name;
    if (category) st.category = category;
    if (phoneNumber !== undefined) st.phoneNumber = phoneNumber;
    if (address !== undefined) st.address = address;
    if (offDay !== undefined) st.offDay = offDay;
    if (deleted !== undefined) st.deleted = deleted;
    await st.save();
    res.json({ staff: st });
  }
);
module.exports = router;
