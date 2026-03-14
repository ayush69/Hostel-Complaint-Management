import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },               // optional - legacy field
  specialMenu: { type: mongoose.Schema.Types.ObjectId, ref: 'SpecialMenu' }, // set when ordered from a special menu
  menuSource: { type: String, enum: ['weekly', 'special'], default: 'weekly' },
  date: { type: Date, required: true },
  mealType: { type: String, enum: ['lunch', 'dinner'], required: true },
  preference: { type: String, enum: ['veg', 'nonVeg'], required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'cancelled'], default: 'pending' },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String }
}, { timestamps: true });

// Prevent duplicate active orders (cancelled orders don't count — student can re-order)
orderSchema.index(
  { student: 1, vendor: 1, date: 1, mealType: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending', 'confirmed', 'delivered'] } } }
);

export default mongoose.model('Order', orderSchema);
