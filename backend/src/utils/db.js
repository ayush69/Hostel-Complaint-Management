const mongoose = require('mongoose');
module.exports = async function connectDB(){ 
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connect error', err.message);
    process.exit(1);
  }
};
