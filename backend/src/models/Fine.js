const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fineSchema = new Schema({
  studentId:{type:Schema.Types.ObjectId, ref:'Student', required:true},
  amount:{type:Number, required:true},
  reason:String,
  dateImposed:{type:Date, default:Date.now},
  status:{type:String, enum:['Paid','Unpaid'], default:'Unpaid'},
  imposedBy:{type:Schema.Types.ObjectId, ref:'Admin'}
}, {timestamps:true});
module.exports = mongoose.model('Fine', fineSchema);
