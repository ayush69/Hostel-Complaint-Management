import mongoose from 'mongoose';
import dns from 'node:dns';

// Use Google Public DNS – the system default DNS on this machine is
// an unreachable IPv6 link-local address, which causes SRV lookups
// (needed by mongodb+srv://) to fail with ECONNREFUSED.
dns.setServers(['8.8.8.8', '8.8.4.4']);

export default async function connectDB(){ 
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connect error', err.message);
    process.exit(1);
  }
}
