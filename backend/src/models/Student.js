import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {type:String, required:true},
  email: {type:String, required:true, unique:true, index:true},
  password: {type:String, required:true},
  rollNo: {type:String, required:true, unique:true, index:true},
  branch:String, phoneNumber:String, roomNo:String, year:String,
  currentFines:[{type:Schema.Types.ObjectId, ref:'Fine'}],
  registeredDate:{type:Date, default:Date.now}
}, {timestamps:true});

export default mongoose.model('Student', studentSchema);
