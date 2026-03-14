import mongoose from 'mongoose';

const mealSchema = {
  available: { type: Boolean, default: true },
  veg: {
    items: [{ type: String }],
    price: { type: Number, default: 0 }
  },
  nonVeg: {
    items: [{ type: String }],
    price: { type: Number, default: 0 }
  }
};

const daySchema = new mongoose.Schema({
  lunch: mealSchema,
  dinner: mealSchema
}, { _id: false });

const weeklyMenuSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    unique: true   // one weekly menu per vendor
  },
  days: {
    monday:    daySchema,
    tuesday:   daySchema,
    wednesday: daySchema,
    thursday:  daySchema,
    friday:    daySchema,
    saturday:  daySchema,
    sunday:    daySchema
  }
}, { timestamps: true });

export default mongoose.model('WeeklyMenu', weeklyMenuSchema);
