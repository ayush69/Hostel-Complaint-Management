import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const DAY_LABELS = { monday:'Monday', tuesday:'Tuesday', wednesday:'Wednesday', thursday:'Thursday', friday:'Friday', saturday:'Saturday', sunday:'Sunday' };

// ─── Sub-components defined OUTSIDE VendorMenu ────────────────────────────────
// Defining them inside would give them a new identity every render, causing
// inputs to unmount/remount and lose focus on every keystroke.

function MealPrefSection({ label, color, items, price, onItemChange, onAddItem, onRemoveItem, onPriceChange }) {
  return (
    <div className={`border rounded-lg p-3 ${color}`}>
      <h5 className='font-semibold text-sm mb-2'>{label}</h5>
      <div className='space-y-1 mb-2'>
        {items.map((item, i) => (
          <div key={i} className='flex gap-1'>
            <Input placeholder='e.g. Paneer Butter Masala' value={item} onChange={e => onItemChange(i, e.target.value)} className='flex-1 text-sm' />
            {items.length > 1 && <button onClick={() => onRemoveItem(i)} className='text-red-500 px-1'>✕</button>}
          </div>
        ))}
      </div>
      <button onClick={onAddItem} className='text-xs text-blue-600 hover:underline mb-2'>+ Add item</button>
      <Input label='Price (₹)' type='number' placeholder='0' value={price} onChange={e => onPriceChange(e.target.value)} />
    </div>
  );
}

function DayMealSection({ mealData, icon, title, onToggleAvail, onItemChange, onAddItem, onRemoveItem, onPriceChange }) {
  return (
    <div className='border-t pt-3 mt-3'>
      <div className='flex items-center justify-between mb-3'>
        <h4 className='font-semibold flex items-center gap-2'>{icon} {title}</h4>
        <label className='flex items-center gap-2 text-sm cursor-pointer'>
          <span>Available</span>
          <input type='checkbox' checked={mealData.available} onChange={onToggleAvail} className='w-4 h-4' />
        </label>
      </div>
      {mealData.available && (
        <div className='grid md:grid-cols-2 gap-3'>
          <MealPrefSection label='🥬 Vegetarian' color='bg-green-50'
            items={mealData.veg.items} price={mealData.veg.price}
            onItemChange={(i, v) => onItemChange('veg', i, v)}
            onAddItem={() => onAddItem('veg')}
            onRemoveItem={i => onRemoveItem('veg', i)}
            onPriceChange={v => onPriceChange('veg', v)} />
          <MealPrefSection label='🍖 Non-Vegetarian' color='bg-red-50'
            items={mealData.nonVeg.items} price={mealData.nonVeg.price}
            onItemChange={(i, v) => onItemChange('nonVeg', i, v)}
            onAddItem={() => onAddItem('nonVeg')}
            onRemoveItem={i => onRemoveItem('nonVeg', i)}
            onPriceChange={v => onPriceChange('nonVeg', v)} />
        </div>
      )}
    </div>
  );
}

function SpecialMealForm({ icon, title, mealData, onToggle, onItemChange, onAddItem, onRemoveItem, onPriceChange }) {
  return (
    <div className='border rounded-lg p-3 mb-3'>
      <div className='flex items-center justify-between mb-2'>
        <h4 className='font-semibold flex items-center gap-2'>{icon} {title}</h4>
        <label className='flex items-center gap-2 text-sm cursor-pointer'>
          <span>Include this meal</span>
          <input type='checkbox' checked={mealData.available} onChange={onToggle} className='w-4 h-4' />
        </label>
      </div>
      {mealData.available && (
        <div className='grid md:grid-cols-2 gap-3'>
          <MealPrefSection label='🥬 Vegetarian' color='bg-green-50'
            items={mealData.veg.items} price={mealData.veg.price}
            onItemChange={(i, v) => onItemChange('veg', i, v)}
            onAddItem={() => onAddItem('veg')}
            onRemoveItem={i => onRemoveItem('veg', i)}
            onPriceChange={v => onPriceChange('veg', v)} />
          <MealPrefSection label='🍖 Non-Vegetarian' color='bg-red-50'
            items={mealData.nonVeg.items} price={mealData.nonVeg.price}
            onItemChange={(i, v) => onItemChange('nonVeg', i, v)}
            onAddItem={() => onAddItem('nonVeg')}
            onRemoveItem={i => onRemoveItem('nonVeg', i)}
            onPriceChange={v => onPriceChange('nonVeg', v)} />
        </div>
      )}
    </div>
  );
}

const emptyMeal = () => ({
  available: true,
  veg:    { items: [''], price: '' },
  nonVeg: { items: [''], price: '' }
});

const emptyDay = () => ({ lunch: emptyMeal(), dinner: emptyMeal() });

const emptyWeek = () => Object.fromEntries(DAYS.map(d => [d, emptyDay()]));

// ─── helpers ──────────────────────────────────────────────────────────────────
function hydrateDays(savedDays) {
  const base = emptyWeek();
  if (!savedDays) return base;
  DAYS.forEach(d => {
    if (!savedDays[d]) return;
    ['lunch','dinner'].forEach(meal => {
      if (!savedDays[d][meal]) return;
      const src = savedDays[d][meal];
      base[d][meal].available = src.available ?? true;
      ['veg','nonVeg'].forEach(pref => {
        if (src[pref]) {
          base[d][meal][pref].items = src[pref].items?.length ? src[pref].items : [''];
          base[d][meal][pref].price = src[pref].price ?? '';
        }
      });
    });
  });
  return base;
}

function emptySpecialForm() {
  return {
    date: new Date().toISOString().split('T')[0],
    note: '',
    lunch:  { available: false, veg: { items: [''], price: '' }, nonVeg: { items: [''], price: '' } },
    dinner: { available: false, veg: { items: [''], price: '' }, nonVeg: { items: [''], price: '' } }
  };
}

// ─── VendorMenu ───────────────────────────────────────────────────────────────
export default function VendorMenu() {
  const [activeTab, setActiveTab]       = useState('weekly');
  const [days, setDays]                 = useState(emptyWeek());
  const [openDays, setOpenDays]         = useState({ monday: true });
  const [savingWeekly, setSavingWeekly] = useState(false);

  const [specials, setSpecials]         = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [specialForm, setSpecialForm]   = useState(emptySpecialForm());
  const [savingSpecial, setSavingSpecial] = useState(false);
  const [editingSpecialId, setEditingSpecialId] = useState(null);

  useEffect(() => { fetchWeekly(); fetchSpecials(); }, []);

  // ── data fetching ────────────────────────────────────────────────────────────
  const fetchWeekly = async () => {
    try {
      const res = await api.get('/vendor/menu/weekly');
      if (res.data) setDays(hydrateDays(res.data.days));
    } catch { /* no menu yet */ }
  };

  const fetchSpecials = async () => {
    try {
      const res = await api.get('/vendor/menu/special');
      setSpecials(res.data);
    } catch { /* ignore */ }
  };

  // ── weekly menu mutators ─────────────────────────────────────────────────────
  const setMealField = (day, meal, pref, field, value) =>
    setDays(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: { ...prev[day][meal], [pref]: { ...prev[day][meal][pref], [field]: value } } }
    }));

  const setItemInDay = (day, meal, pref, i, val) => {
    const items = [...days[day][meal][pref].items];
    items[i] = val;
    setMealField(day, meal, pref, 'items', items);
  };

  const addItemInDay    = (day, meal, pref) => setMealField(day, meal, pref, 'items', [...days[day][meal][pref].items, '']);
  const removeItemInDay = (day, meal, pref, i) => setMealField(day, meal, pref, 'items', days[day][meal][pref].items.filter((_, idx) => idx !== i));

  const toggleMealAvail = (day, meal) =>
    setDays(prev => ({ ...prev, [day]: { ...prev[day], [meal]: { ...prev[day][meal], available: !prev[day][meal].available } } }));

  const saveWeekly = async () => {
    setSavingWeekly(true);
    try {
      // clean up empty items before sending
      const cleaned = {};
      DAYS.forEach(d => {
        cleaned[d] = {};
        ['lunch','dinner'].forEach(meal => {
          cleaned[d][meal] = {
            available: days[d][meal].available,
            veg:    { items: days[d][meal].veg.items.filter(i => i.trim()),    price: Number(days[d][meal].veg.price)    || 0 },
            nonVeg: { items: days[d][meal].nonVeg.items.filter(i => i.trim()), price: Number(days[d][meal].nonVeg.price) || 0 }
          };
        });
      });
      await api.put('/vendor/menu/weekly', { days: cleaned });
      toast.success('Weekly menu saved!');
    } catch { toast.error('Failed to save weekly menu'); }
    finally { setSavingWeekly(false); }
  };

  // ── special menu mutators ────────────────────────────────────────────────────
  const setSpecialMealField = (meal, pref, field, value) =>
    setSpecialForm(prev => ({
      ...prev,
      [meal]: { ...prev[meal], [pref]: { ...prev[meal][pref], [field]: value } }
    }));

  const setSpecialItem    = (meal, pref, i, val) => { const items = [...specialForm[meal][pref].items]; items[i] = val; setSpecialMealField(meal, pref, 'items', items); };
  const addSpecialItem    = (meal, pref)          => setSpecialMealField(meal, pref, 'items', [...specialForm[meal][pref].items, '']);
  const removeSpecialItem = (meal, pref, i)       => setSpecialMealField(meal, pref, 'items', specialForm[meal][pref].items.filter((_, idx) => idx !== i));
  const toggleSpecialMeal = (meal)                =>
    setSpecialForm(prev => ({ ...prev, [meal]: { ...prev[meal], available: !prev[meal].available } }));

  const saveSpecial = async () => {
    setSavingSpecial(true);
    try {
      const cleaned = {
        date:   specialForm.date,
        note:   specialForm.note,
        lunch:  { ...specialForm.lunch,  veg: { items: specialForm.lunch.veg.items.filter(i=>i.trim()),  price: Number(specialForm.lunch.veg.price)||0  }, nonVeg: { items: specialForm.lunch.nonVeg.items.filter(i=>i.trim()),  price: Number(specialForm.lunch.nonVeg.price)||0  } },
        dinner: { ...specialForm.dinner, veg: { items: specialForm.dinner.veg.items.filter(i=>i.trim()), price: Number(specialForm.dinner.veg.price)||0 }, nonVeg: { items: specialForm.dinner.nonVeg.items.filter(i=>i.trim()), price: Number(specialForm.dinner.nonVeg.price)||0 } }
      };
      if (editingSpecialId) {
        await api.put(`/vendor/menu/special/${editingSpecialId}`, cleaned);
        toast.success('Special menu updated!');
      } else {
        await api.post('/vendor/menu/special', cleaned);
        toast.success('Special menu added!');
      }
      setShowForm(false);
      setSpecialForm(emptySpecialForm());
      setEditingSpecialId(null);
      fetchSpecials();
    } catch { toast.error('Failed to save special menu'); }
    finally { setSavingSpecial(false); }
  };

  const deleteSpecial = async (id) => {
    if (!confirm('Delete this special menu?')) return;
    try {
      await api.delete(`/vendor/menu/special/${id}`);
      toast.success('Deleted');
      fetchSpecials();
    } catch { toast.error('Failed to delete'); }
  };

  const startEditSpecial = (s) => {
    setEditingSpecialId(s._id);
    setSpecialForm({
      date:   new Date(s.date).toISOString().split('T')[0],
      note:   s.note || '',
      lunch:  { available: s.lunch.available,  veg: { items: s.lunch.veg.items.length  ? s.lunch.veg.items  : [''], price: s.lunch.veg.price  || '' }, nonVeg: { items: s.lunch.nonVeg.items.length  ? s.lunch.nonVeg.items  : [''], price: s.lunch.nonVeg.price  || '' } },
      dinner: { available: s.dinner.available, veg: { items: s.dinner.veg.items.length ? s.dinner.veg.items : [''], price: s.dinner.veg.price || '' }, nonVeg: { items: s.dinner.nonVeg.items.length ? s.dinner.nonVeg.items : [''], price: s.dinner.nonVeg.price || '' } }
    });
    setShowForm(true);
  };

  // ── main render ──────────────────────────────────────────────────────────────
  return (
    <div className='p-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Menu Management</h1>
        <p className='text-gray-500 mt-1'>Set your weekly menu once. Add specials for any day.</p>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 mb-6 border-b'>
        {[['weekly','📅 Weekly Menu'],['special','⭐ Special Menu']].map(([key,label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-2 font-medium text-sm border-b-2 -mb-px transition-colors
              ${activeTab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Weekly Menu Tab ─────────────────────────────────────────────────── */}
      {activeTab === 'weekly' && (
        <>
          <p className='text-sm text-gray-500 mb-4'>Fill in your standard menu for each day of the week. Students will always see this unless you add a special for that day.</p>
          {DAYS.map(day => (
            <Card key={day} className='mb-3'>
              <button className='w-full flex items-center justify-between font-semibold text-lg'
                onClick={() => setOpenDays(p => ({ ...p, [day]: !p[day] }))}>
                <span>{DAY_LABELS[day]}</span>
                <span>{openDays[day] ? '▲' : '▼'}</span>
              </button>
              {openDays[day] && (
                <div className='mt-2'>
                  <DayMealSection mealData={days[day].lunch}  icon='🌅' title='Lunch'
                    onToggleAvail={() => toggleMealAvail(day, 'lunch')}
                    onItemChange={(pref, i, v) => setItemInDay(day, 'lunch', pref, i, v)}
                    onAddItem={pref => addItemInDay(day, 'lunch', pref)}
                    onRemoveItem={(pref, i) => removeItemInDay(day, 'lunch', pref, i)}
                    onPriceChange={(pref, v) => setMealField(day, 'lunch', pref, 'price', v)} />
                  <DayMealSection mealData={days[day].dinner} icon='🌙' title='Dinner'
                    onToggleAvail={() => toggleMealAvail(day, 'dinner')}
                    onItemChange={(pref, i, v) => setItemInDay(day, 'dinner', pref, i, v)}
                    onAddItem={pref => addItemInDay(day, 'dinner', pref)}
                    onRemoveItem={(pref, i) => removeItemInDay(day, 'dinner', pref, i)}
                    onPriceChange={(pref, v) => setMealField(day, 'dinner', pref, 'price', v)} />
                </div>
              )}
            </Card>
          ))}
          <div className='flex justify-end mt-4'>
            <Button onClick={saveWeekly} loading={savingWeekly} size='lg'>
              💾 Save Weekly Menu
            </Button>
          </div>
        </>
      )}

      {/* ── Special Menu Tab ────────────────────────────────────────────────── */}
      {activeTab === 'special' && (
        <>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm text-gray-500'>Add a special menu for a specific date — shown alongside the regular menu for that day.</p>
            <Button onClick={() => { setShowForm(true); setEditingSpecialId(null); setSpecialForm(emptySpecialForm()); }}>
              + Add Special
            </Button>
          </div>

          {/* Special menu form */}
          {showForm && (
            <Card className='mb-6 border-2 border-blue-200'>
              <h3 className='font-bold text-lg mb-4'>{editingSpecialId ? 'Edit Special Menu' : 'New Special Menu'}</h3>
              <div className='grid md:grid-cols-2 gap-4 mb-4'>
                <Input label='Date' type='date' value={specialForm.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSpecialForm(p => ({ ...p, date: e.target.value }))} />
                <Input label='Label / Note (e.g. "Diwali Special")' placeholder='Optional note'
                  value={specialForm.note} onChange={e => setSpecialForm(p => ({ ...p, note: e.target.value }))} />
              </div>
              <SpecialMealForm icon='🌅' title='Lunch'  mealData={specialForm.lunch}
                onToggle={() => toggleSpecialMeal('lunch')}
                onItemChange={(pref, i, v) => setSpecialItem('lunch', pref, i, v)}
                onAddItem={pref => addSpecialItem('lunch', pref)}
                onRemoveItem={(pref, i) => removeSpecialItem('lunch', pref, i)}
                onPriceChange={(pref, v) => setSpecialMealField('lunch', pref, 'price', v)} />
              <SpecialMealForm icon='🌙' title='Dinner' mealData={specialForm.dinner}
                onToggle={() => toggleSpecialMeal('dinner')}
                onItemChange={(pref, i, v) => setSpecialItem('dinner', pref, i, v)}
                onAddItem={pref => addSpecialItem('dinner', pref)}
                onRemoveItem={(pref, i) => removeSpecialItem('dinner', pref, i)}
                onPriceChange={(pref, v) => setSpecialMealField('dinner', pref, 'price', v)} />
              <div className='flex gap-3 mt-4'>
                <Button variant='secondary' onClick={() => { setShowForm(false); setEditingSpecialId(null); }}>Cancel</Button>
                <Button onClick={saveSpecial} loading={savingSpecial}>Save Special</Button>
              </div>
            </Card>
          )}

          {/* List of specials */}
          {specials.length === 0 && !showForm && (
            <Card><p className='text-center text-gray-500 py-6'>No special menus added yet.</p></Card>
          )}
          {specials.map(s => (
            <Card key={s._id} className='mb-3'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='font-bold text-gray-900'>{new Date(s.date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
                  {s.note && <p className='text-blue-600 font-medium text-sm mt-0.5'>⭐ {s.note}</p>}
                  <div className='flex gap-4 mt-2 text-sm text-gray-600'>
                    {s.lunch.available  && <span>🌅 Lunch</span>}
                    {s.dinner.available && <span>🌙 Dinner</span>}
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button size='sm' variant='secondary' onClick={() => startEditSpecial(s)}>Edit</Button>
                  <Button size='sm' variant='danger'    onClick={() => deleteSpecial(s._id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
