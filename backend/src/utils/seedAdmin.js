import dotenv from 'dotenv';
import connectDB from './db.js';
import Admin from '../models/Admin.js';
import { hashPassword } from './hash.js';

dotenv.config();

(async ()=>{ 
  await connectDB(); 
  const exists = await Admin.findOne({ email: process.env.SEED_ADMIN_EMAIL || 'admin@hcm.local' }); 
  if (exists) { 
    console.log('Admin exists'); 
    process.exit(0); 
  } 
  const pwd = process.env.SEED_ADMIN_PASSWORD || 'password123'; 
  const hashed = await hashPassword(pwd); 
  const a = await Admin.create({ 
    name:'Admin', 
    email: process.env.SEED_ADMIN_EMAIL || 'admin@hcm.local', 
    password: hashed, 
    role:'Warden' 
  }); 
  console.log('Created admin', a.email, 'pwd', pwd); 
  process.exit(0); 
})();
