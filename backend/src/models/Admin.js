import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name:{type:String, required:true},
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true},
  role:{type:String, enum:['Warden','Caretaker'], default:'Warden'},
  phoneNumber:String
}, {timestamps:true});

export default mongoose.model('Admin', adminSchema);
