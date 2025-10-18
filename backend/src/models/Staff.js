const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const staffSchema = new Schema({
  name:{type:String, required:true},
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true},
  category:{type:String, enum:['Electrician','Plumber','Carpenter','Cleaner','Maintenance','Other'], default:'Other'},
  phoneNumber:String, address:String,
  offDay:String,
  joinedDate:{type:Date, default:Date.now},
  averageRating:{type:Number, default:0},
  completedTasks:{type:Number, default:0},
  deleted:{type:Boolean, default:false}
}, {timestamps:true});
module.exports = mongoose.model('Staff', staffSchema);
