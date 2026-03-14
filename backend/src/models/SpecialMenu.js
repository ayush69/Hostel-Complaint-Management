import mongoose from 'mongoose';

// A special/override menu a vendor can post for a specific date.
// Students see it as "Today's Special" in addition to the weekly menu.

const specialMenuSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  date: { type: Date, required: true },
  note: { type: String, default: '' },   // e.g. "Diwali Special"
  lunch: {
    available: { type: Boolean, default: false },
    veg:    { items: [{ type: String }], price: { type: Number, default: 0 } },
    nonVeg: { items: [{ type: String }], price: { type: Number, default: 0 } }
  },
  dinner: {
    available: { type: Boolean, default: false },
    veg:    { items: [{ type: String }], price: { type: Number, default: 0 } },
    nonVeg: { items: [{ type: String }], price: { type: Number, default: 0 } }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// one special menu per vendor per date
specialMenuSchema.index({ vendor: 1, date: 1 }, { unique: true });

export default mongoose.model('SpecialMenu', specialMenuSchema);
