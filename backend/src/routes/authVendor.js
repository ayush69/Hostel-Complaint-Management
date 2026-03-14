import express from 'express';
import Vendor from '../models/Vendor.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';

const router = express.Router();

// Vendor Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    
    if (!vendor.isActive) return res.status(403).json({ message: 'Account is inactive' });
    
    const valid = await verifyPassword(password, vendor.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = signToken({ id: vendor._id, role: 'vendor' });
    res.json({ token, vendor: { id: vendor._id, name: vendor.name, shopName: vendor.shopName, email: vendor.email } });
  } catch (err) {
    next(err);
  }
});

export default router;
