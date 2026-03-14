import express from 'express';
import WeeklyMenu from '../models/WeeklyMenu.js';
import SpecialMenu from '../models/SpecialMenu.js';
import { vendorAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require vendor authentication
router.use(vendorAuth);

// ─── Weekly Menu ───────────────────────────────────────────────────────────────

// GET vendor's weekly menu
router.get('/weekly', async (req, res, next) => {
  try {
    const menu = await WeeklyMenu.findOne({ vendor: req.user.id });
    res.json(menu || null);
  } catch (err) {
    next(err);
  }
});

// PUT (save/update) vendor's weekly menu — whole week in one request
router.put('/weekly', async (req, res, next) => {
  try {
    const { days } = req.body;
    const menu = await WeeklyMenu.findOneAndUpdate(
      { vendor: req.user.id },
      { days },
      { new: true, upsert: true, runValidators: false }
    );
    res.json({ message: 'Weekly menu saved', menu });
  } catch (err) {
    next(err);
  }
});

// ─── Special Menu ──────────────────────────────────────────────────────────────

// GET all special menus for this vendor
router.get('/special', async (req, res, next) => {
  try {
    const specials = await SpecialMenu.find({ vendor: req.user.id }).sort({ date: 1 });
    res.json(specials);
  } catch (err) {
    next(err);
  }
});

// POST create/update special menu for a date
router.post('/special', async (req, res, next) => {
  try {
    const { date, note, lunch, dinner } = req.body;
    const menuDate = new Date(date);
    menuDate.setHours(0, 0, 0, 0);
    const special = await SpecialMenu.findOneAndUpdate(
      { vendor: req.user.id, date: menuDate },
      { note, lunch, dinner, isActive: true },
      { new: true, upsert: true, runValidators: false }
    );
    res.json({ message: 'Special menu saved', special });
  } catch (err) {
    next(err);
  }
});

// PUT update a special menu
router.put('/special/:id', async (req, res, next) => {
  try {
    const { isActive, note, lunch, dinner } = req.body;
    const special = await SpecialMenu.findOne({ _id: req.params.id, vendor: req.user.id });
    if (!special) return res.status(404).json({ message: 'Special menu not found' });
    if (isActive !== undefined) special.isActive = isActive;
    if (note !== undefined) special.note = note;
    if (lunch !== undefined) special.lunch = lunch;
    if (dinner !== undefined) special.dinner = dinner;
    await special.save();
    res.json({ message: 'Special menu updated', special });
  } catch (err) {
    next(err);
  }
});

// DELETE special menu
router.delete('/special/:id', async (req, res, next) => {
  try {
    const special = await SpecialMenu.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    if (!special) return res.status(404).json({ message: 'Special menu not found' });
    res.json({ message: 'Special menu deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
