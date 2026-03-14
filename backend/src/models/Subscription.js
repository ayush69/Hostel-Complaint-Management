import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  mealType: { type: String, enum: ['lunch', 'dinner', 'both'], required: true },
  preference: { type: String, enum: ['veg', 'nonVeg'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  skipDates: [{ type: Date }] // Days to skip
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
