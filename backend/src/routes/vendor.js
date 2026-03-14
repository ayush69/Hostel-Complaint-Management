import express from 'express';
import Vendor from '../models/Vendor.js';
import { hashPassword } from '../utils/hash.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Get all vendors
router.get('/', async (req, res, next) => {
  try {
    const vendors = await Vendor.find().select('-password').sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    next(err);
  }
});

// Get single vendor
router.get('/:id', async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    next(err);
  }
});

// Create vendor
router.post('/', async (req, res, next) => {
  try {
    const { name, email, password, phone, shopName, description } = req.body;
    
    const exists = await Vendor.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    
    const hashedPassword = await hashPassword(password);
    const vendor = await Vendor.create({
      name,
      email,
      password: hashedPassword,
      phone,
      shopName,
      description
    });
    
    res.status(201).json({ message: 'Vendor created', vendor: { id: vendor._id, name: vendor.name, shopName: vendor.shopName } });
  } catch (err) {
    next(err);
  }
});

// Update vendor
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, phone, shopName, description, isActive } = req.body;
    
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, shopName, description, isActive },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor updated', vendor });
  } catch (err) {
    next(err);
  }
});

// Delete vendor
router.delete('/:id', async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
