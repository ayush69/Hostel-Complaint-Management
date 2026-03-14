import express from 'express';
import Order from '../models/Order.js';
import WeeklyMenu from '../models/WeeklyMenu.js';
import SpecialMenu from '../models/SpecialMenu.js';
import Subscription from '../models/Subscription.js';
import Vendor from '../models/Vendor.js';
import { studentAuth, vendorAuth } from '../middleware/auth.js';

const DAY_NAMES = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

const router = express.Router();

// Get all active vendors (public for students)
router.get('/vendors', studentAuth, async (req, res, next) => {
  try {
    const vendors = await Vendor.find({ isActive: true }).select('-password');
    res.json(vendors);
  } catch (err) {
    next(err);
  }
});

// Get menus for a specific date (weekly + any special for that date)
router.get('/menus/:date', studentAuth, async (req, res, next) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    const dayName = DAY_NAMES[date.getDay()];

    const vendors = await Vendor.find({ isActive: true }).select('-password').lean();
    const vendorIds = vendors.map(v => v._id);

    const [weeklyMenus, specialMenus] = await Promise.all([
      WeeklyMenu.find({ vendor: { $in: vendorIds } }).lean(),
      SpecialMenu.find({ vendor: { $in: vendorIds }, date, isActive: true }).lean()
    ]);

    const result = vendors.map(vendor => {
      const weekly = weeklyMenus.find(m => m.vendor.toString() === vendor._id.toString());
      const special = specialMenus.find(m => m.vendor.toString() === vendor._id.toString()) || null;
      const todayMenu = weekly ? (weekly.days[dayName] || null) : null;
      return { vendor, todayMenu, specialMenu: special };
    }).filter(v => v.todayMenu || v.specialMenu);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get full weekly menu for a specific vendor (so students can view the whole week)
router.get('/vendors/:id/weeklymenu', studentAuth, async (req, res, next) => {
  try {
    const menu = await WeeklyMenu.findOne({ vendor: req.params.id }).lean();
    res.json(menu || null);
  } catch (err) {
    next(err);
  }
});

// Place an order (with time validation)
router.post('/orders', studentAuth, async (req, res, next) => {
  try {
    const { vendorId, date, mealType, preference, quantity, menuSource } = req.body;
    // menuSource: 'weekly' (default) | 'special'
    const source = menuSource === 'special' ? 'special' : 'weekly';

    // CRITICAL: Use server time for all validation - client time cannot be trusted
    const serverNow = new Date();
    const orderDate = new Date(date);
    orderDate.setHours(0, 0, 0, 0);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    // Prevent ordering for past dates
    if (orderDate < todayDate) {
      return res.status(400).json({ message: 'Cannot order for past dates' });
    }

    // Check if ordering for today - use SERVER time
    const isToday = serverNow.toDateString() === orderDate.toDateString();

    if (isToday) {
      const currentTime = serverNow.getHours() * 60 + serverNow.getMinutes();
      if (mealType === 'lunch' && currentTime >= 1380) {
        return res.status(400).json({ message: 'Lunch orders must be placed before 12:00 PM' });
      }
      if (mealType === 'dinner' && currentTime >= 1380) {
        return res.status(400).json({ message: 'Dinner orders must be placed before 7:00 PM' });
      }
    }

    // Prevent duplicate active orders (cancelled orders don't block re-ordering)
    const existing = await Order.findOne({
      student: req.user.id,
      vendor: vendorId,
      date: orderDate,
      mealType,
      status: { $in: ['pending', 'confirmed', 'delivered'] }
    });
    if (existing) {
      return res.status(400).json({ message: `You already have an active ${mealType} order for this day` });
    }

    // Look up effective price from the chosen menu source
    let price = 0;
    let specialMenuRef = undefined;

    if (source === 'special') {
      const special = await SpecialMenu.findOne({ vendor: vendorId, date: orderDate, isActive: true });
      if (!special) return res.status(404).json({ message: 'Special menu not found for this date' });
      if (!special[mealType] || !special[mealType].available) {
        return res.status(400).json({ message: `${mealType} is not available in special menu` });
      }
      price = special[mealType][preference]?.price;
      if (!price) return res.status(400).json({ message: 'Invalid preference in special menu' });
      specialMenuRef = special._id;
    } else {
      const dayName = DAY_NAMES[orderDate.getDay()];
      const weekly = await WeeklyMenu.findOne({ vendor: vendorId });
      if (!weekly) return res.status(404).json({ message: 'Vendor has no weekly menu set up' });
      const dayMenu = weekly.days[dayName];
      if (!dayMenu || !dayMenu[mealType] || !dayMenu[mealType].available) {
        return res.status(400).json({ message: `${mealType} is not available on this day` });
      }
      price = dayMenu[mealType][preference]?.price;
      if (!price) return res.status(400).json({ message: 'Invalid preference' });
    }

    // Create order
    const order = await Order.create({
      student: req.user.id,
      vendor: vendorId,
      specialMenu: specialMenuRef,
      menuSource: source,
      date: orderDate,
      mealType,
      preference,
      quantity: quantity || 1,
      price: price * (quantity || 1)
    });

    await order.populate('vendor', '-password');
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already have an order for this meal' });
    }
    next(err);
  }
});

// Get student's orders
router.get('/orders', studentAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ student: req.user.id })
      .populate('vendor', '-password')
      .sort({ date: -1, createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Cancel order
router.delete('/orders/:id', studentAuth, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, student: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // CRITICAL: Check if can cancel using SERVER time - client time cannot be trusted
    const serverNow = new Date();
    const orderDate = new Date(order.date);
    const isToday = serverNow.toDateString() === orderDate.toDateString();
    
    if (isToday) {
      const currentHour = serverNow.getHours();
      const currentMinute = serverNow.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;
      
      // Same cutoff times as ordering
      if (order.mealType === 'lunch' && currentTime >= 1380) {
        return res.status(400).json({ message: 'Cannot cancel lunch order after 12:00 PM' });
      }
      if (order.mealType === 'dinner' && currentTime >= 1380) {
        return res.status(400).json({ message: 'Cannot cancel dinner order after 7:00 PM' });
      }
    }
    
    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    next(err);
  }
});

// Rate order
router.post('/orders/:id/rate', studentAuth, async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    
    const order = await Order.findOne({ _id: req.params.id, student: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate delivered orders' });
    }
    
    order.rating = rating;
    order.feedback = feedback;
    await order.save();
    
    // Update vendor rating
    const vendor = await Vendor.findById(order.vendor);
    const totalRating = vendor.rating * vendor.totalRatings + rating;
    vendor.totalRatings += 1;
    vendor.rating = totalRating / vendor.totalRatings;
    await vendor.save();
    
    res.json({ message: 'Rating submitted', order });
  } catch (err) {
    next(err);
  }
});

// Create subscription
router.post('/subscriptions', studentAuth, async (req, res, next) => {
  try {
    const { vendorId, mealType, preference, startDate, endDate } = req.body;
    
    const subscription = await Subscription.create({
      student: req.user.id,
      vendor: vendorId,
      mealType,
      preference,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null
    });
    
    await subscription.populate('vendor', '-password');
    res.status(201).json({ message: 'Subscription created', subscription });
  } catch (err) {
    next(err);
  }
});

// Get student's subscriptions
router.get('/subscriptions', studentAuth, async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ student: req.user.id })
      .populate('vendor', '-password')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (err) {
    next(err);
  }
});

// Update subscription (pause/resume)
router.put('/subscriptions/:id', studentAuth, async (req, res, next) => {
  try {
    const { isActive, skipDates, endDate } = req.body;
    
    const subscription = await Subscription.findOne({ 
      _id: req.params.id, 
      student: req.user.id 
    });
    
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    
    if (isActive !== undefined) subscription.isActive = isActive;
    if (skipDates) subscription.skipDates = skipDates.map(d => new Date(d));
    if (endDate) subscription.endDate = new Date(endDate);
    
    await subscription.save();
    res.json({ message: 'Subscription updated', subscription });
  } catch (err) {
    next(err);
  }
});

// Delete subscription
router.delete('/subscriptions/:id', studentAuth, async (req, res, next) => {
  try {
    const subscription = await Subscription.findOneAndDelete({ 
      _id: req.params.id, 
      student: req.user.id 
    });
    
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription cancelled' });
  } catch (err) {
    next(err);
  }
});

// Vendor: Get today's orders
router.get('/vendor/orders/today', vendorAuth, async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = await Order.find({ 
      vendor: req.user.id, 
      date: today,
      status: { $ne: 'cancelled' }
    })
      .populate('student', 'name rollNo room phone')
      .sort({ mealType: 1, preference: 1 });
    
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Vendor: Update order status
router.put('/vendor/orders/:id', vendorAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findOne({ 
      _id: req.params.id, 
      vendor: req.user.id 
    });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = status;
    await order.save();
    
    res.json({ message: 'Order updated', order });
  } catch (err) {
    next(err);
  }
});

// Vendor: Get all orders with filters
router.get('/vendor/orders', vendorAuth, async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const filter = { vendor: req.user.id };
    
    if (date) {
      const orderDate = new Date(date);
      orderDate.setHours(0, 0, 0, 0);
      filter.date = orderDate;
    }
    
    if (status) filter.status = status;
    
    const orders = await Order.find(filter)
      .populate('student', 'name rollNo room phone')
      .sort({ date: -1, createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Vendor: Get order history with date range + pagination + stats
router.get('/vendor/orders/history', vendorAuth, async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = { vendor: req.user.id };

    // Default: last 30 days if no range provided
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    start.setHours(0, 0, 0, 0);
    filter.date = { $gte: start, $lte: end };

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total, statsAgg] = await Promise.all([
      Order.find(filter)
        .populate('student', 'name rollNo room phone')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
      Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$price' },
            vegCount: { $sum: { $cond: [{ $eq: ['$preference', 'veg'] }, 1, 0] } },
            nonVegCount: { $sum: { $cond: [{ $eq: ['$preference', 'nonVeg'] }, 1, 0] } },
            deliveredCount: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
            cancelledCount: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
          }
        }
      ])
    ]);

    const stats = statsAgg[0] || { totalOrders: 0, totalRevenue: 0, vegCount: 0, nonVegCount: 0, deliveredCount: 0, cancelledCount: 0 };

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      stats
    });
  } catch (err) {
    next(err);
  }
});

export default router;
