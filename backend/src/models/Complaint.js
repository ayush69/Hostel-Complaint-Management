const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const complaintSchema = new Schema({
  title:{type:String, required:true},
  description:String,
  category:{type:String, enum:['Electrician','Plumber','Carpenter','Cleaner','Maintenance','Other']},
  isAnonymous:{type:Boolean, default:false},
  studentId:{type:Schema.Types.ObjectId, ref:'Student', default:null},
  studentName:String,
  roomNo:String,
  status:{type:String, enum:['Pending','Assigned','InProgress','Completed'], default:'Pending'},
  assignedStaffId:{type:Schema.Types.ObjectId, ref:'Staff', default:null},
  raisedDate:{type:Date, default:Date.now},
  assignedDate:Date,
  completedDate:Date,
  rating:{type:Number, min:1, max:5},
  feedback:String
}, {timestamps:true});
complaintSchema.index({ status:1, category:1 });
module.exports = mongoose.model('Complaint', complaintSchema);
