const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema({
  name:{type:String, required:true},
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true},
  role:{type:String, enum:['Warden','Caretaker'], default:'Warden'},
  phoneNumber:String
}, {timestamps:true});
module.exports = mongoose.model('Admin', adminSchema);
