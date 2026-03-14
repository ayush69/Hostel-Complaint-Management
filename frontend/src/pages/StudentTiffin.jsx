import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import StarRating from '../components/StarRating';

const DAYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const DAY_LABELS = { monday:'Monday', tuesday:'Tuesday', wednesday:'Wednesday', thursday:'Thursday', friday:'Friday', saturday:'Saturday', sunday:'Sunday' };

export default function StudentTiffin() {
  const [activeTab, setActiveTab]         = useState('today');
  const [selectedDate, setSelectedDate]   = useState(new Date().toISOString().split('T')[0]);
  const [menus, setMenus]                 = useState([]);
  const [myOrders, setMyOrders]           = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showSubscribeModal, setShowSubscribeModal] = useState(null);

  // Per-vendor weekly menu cache { vendorId: weeklyMenuDoc }
  const [weeklyMenus, setWeeklyMenus]     = useState({});
  const [expandedVendor, setExpandedVendor] = useState(null);
  const [allVendors, setAllVendors]         = useState([]);

  useEffect(() => { fetchData(); }, [selectedDate]);
  useEffect(() => { fetchAllVendors(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menusRes, ordersRes, subsRes] = await Promise.all([
        api.get(`/tiffin/menus/${selectedDate}`),
        api.get('/tiffin/orders'),
        api.get('/tiffin/subscriptions')
      ]);
      setMenus(menusRes.data);
      setMyOrders(ordersRes.data);
      setSubscriptions(subsRes.data);
    } catch {
      toast.error('Failed to load tiffin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVendors = async () => {
    try {
      const res = await api.get('/tiffin/vendors');
      setAllVendors(res.data);
    } catch { /* ignore */ }
  };

  const fetchVendorWeeklyMenu = async (vendorId) => {
    if (weeklyMenus[vendorId]) return; // already cached
    try {
      const res = await api.get(`/tiffin/vendors/${vendorId}/weeklymenu`);
      setWeeklyMenus(prev => ({ ...prev, [vendorId]: res.data }));
    } catch { /* ignore */ }
  };

  const canOrder = (mealType) => {
    const now = new Date();
    const isToday = now.toDateString() === new Date(selectedDate).toDateString();
    if (!isToday) return true;
    const mins = now.getHours() * 60 + now.getMinutes();
    if (mealType === 'lunch'  && mins >= 1380) return false;
    if (mealType === 'dinner' && mins >= 1380) return false;
    return true;
  };

  const hasOrdered = (vendorId, mealType) =>
    myOrders.some(o =>
      o.vendor._id === vendorId &&
      o.mealType === mealType &&
      new Date(o.date).toDateString() === new Date(selectedDate).toDateString() &&
      o.status !== 'cancelled'
    );

  const placeOrder = async (vendorId, mealType, preference, menuSource = 'weekly') => {
    if (!canOrder(mealType)) {
      toast.error(`${mealType} orders must be placed before ${mealType === 'lunch' ? '12 PM' : '7 PM'}`);
      return;
    }
    if (hasOrdered(vendorId, mealType)) {
      toast.error(`You already have an order for ${mealType}`);
      return;
    }
    try {
      await api.post('/tiffin/orders', { vendorId, date: selectedDate, mealType, preference, quantity: 1, menuSource });
      toast.success('Order placed!');
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.delete(`/tiffin/orders/${orderId}`);
      toast.success('Order cancelled');
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel order');
    }
  };

  const createSubscription = async (vendorId, data) => {
    try {
      await api.post('/tiffin/subscriptions', { vendorId, ...data });
      toast.success('Subscription created!');
      setShowSubscribeModal(null);
      fetchData();
    } catch { toast.error('Failed to create subscription'); }
  };

  // ── Meal cards ────────────────────────────────────────────────────────────
  const MealCard = ({ vendorId, meal, mealType, icon, menuSource }) => {
    if (!meal || !meal.available) return null;
    const ordered  = hasOrdered(vendorId, mealType);
    const canNow   = canOrder(mealType);
    const isSpecial = menuSource === 'special';

    return (
      <div className={`border-t pt-4 mt-4 ${isSpecial ? 'border-yellow-300' : ''}`}>
        <div className='flex items-center justify-between mb-3'>
          <h4 className='font-semibold flex items-center gap-2'>
            {icon} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            {isSpecial && <Badge variant='warning'>⭐ Special</Badge>}
          </h4>
          {!canNow  && <Badge variant='danger'>Ordering closed</Badge>}
          {ordered  && <Badge variant='success'>✓ Ordered</Badge>}
        </div>
        <div className='grid md:grid-cols-2 gap-4'>
          {meal.veg?.items?.length > 0 && meal.veg?.price > 0 && (
            <div className='border rounded-lg p-3 bg-green-50'>
              <div className='flex justify-between mb-2'>
                <span className='font-medium text-green-700'>🥬 Veg</span>
                <span className='font-bold text-green-700'>₹{meal.veg.price}</span>
              </div>
              <ul className='text-sm text-gray-700 mb-3 space-y-1'>{meal.veg.items.map((item, i) => <li key={i}>• {item}</li>)}</ul>
              <Button size='sm' variant='success' className='w-full' disabled={!canNow || ordered}
                onClick={() => placeOrder(vendorId, mealType, 'veg', menuSource)}>
                {ordered ? 'Already Ordered' : 'Order Veg'}
              </Button>
            </div>
          )}
          {meal.nonVeg?.items?.length > 0 && meal.nonVeg?.price > 0 && (
            <div className='border rounded-lg p-3 bg-red-50'>
              <div className='flex justify-between mb-2'>
                <span className='font-medium text-red-700'>🍖 Non-Veg</span>
                <span className='font-bold text-red-700'>₹{meal.nonVeg.price}</span>
              </div>
              <ul className='text-sm text-gray-700 mb-3 space-y-1'>{meal.nonVeg.items.map((item, i) => <li key={i}>• {item}</li>)}</ul>
              <Button size='sm' variant='danger' className='w-full' disabled={!canNow || ordered}
                onClick={() => placeOrder(vendorId, mealType, 'nonVeg', menuSource)}>
                {ordered ? 'Already Ordered' : 'Order Non-Veg'}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className='p-6'>Loading…</div>;

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex justify-between items-start mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Tiffin Services</h1>
          <p className='text-gray-600 mt-1'>Order meals from hostel vendors</p>
        </div>
        <div className='flex gap-2'>
          <Link to='/student/tiffin/history'>
            <Button variant='secondary'>🕒 Order History</Button>
          </Link>
          <Link to='/student/tiffin/subscriptions'>
            <Button variant='secondary'>📋 My Subscriptions</Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 mb-6 border-b'>
        {[['today','🍽️ Today\'s Menu'], ['weekly','📅 Full Weekly Menu']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-2 font-medium text-sm border-b-2 -mb-px transition-colors
              ${activeTab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── TODAY'S MENU TAB ──────────────────────────────────────────────── */}
      {activeTab === 'today' && (
        <>
          {/* Date Selector */}
          <Card className='mb-6'>
            <div className='flex flex-wrap items-center gap-4'>
              <label className='font-medium'>Select Date:</label>
              <input type='date' value={selectedDate} min={new Date().toISOString().split('T')[0]}
                onChange={e => setSelectedDate(e.target.value)} className='border rounded px-3 py-2' />
              <div className='text-sm text-gray-600'>
                {canOrder('lunch')  ? '✓ Lunch open'  : '✗ Lunch closed'} {' | '}
                {canOrder('dinner') ? '✓ Dinner open' : '✗ Dinner closed'}
              </div>
            </div>
          </Card>

          {/* Active subscriptions banner */}
          {subscriptions.filter(s => s.isActive).length > 0 && (
            <Card className='mb-6 bg-blue-50 border-blue-200'>
              <p className='text-sm text-blue-800'>
                <span className='font-medium'>📌 {subscriptions.filter(s => s.isActive).length} active subscription(s).</span>{' '}
                <Link to='/student/tiffin/subscriptions' className='underline'>View My Subscriptions</Link>
              </p>
            </Card>
          )}

          {/* Vendor menu list */}
          {menus.length === 0 ? (
            <Card><p className='text-center text-gray-500 py-8'>No menus available for this date.</p></Card>
          ) : (
            <div className='space-y-6'>
              {menus.map(({ vendor, todayMenu, specialMenu }) => (
                <Card key={vendor._id}>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <h3 className='text-2xl font-bold text-gray-900'>{vendor.shopName}</h3>
                      <p className='text-gray-600'>{vendor.description}</p>
                      <div className='flex items-center gap-4 mt-2'>
                        <StarRating rating={vendor.rating} />
                        <span className='text-sm text-gray-500'>({vendor.totalRatings} ratings)</span>
                      </div>
                    </div>
                    <Button variant='secondary' size='sm' onClick={() => setShowSubscribeModal(vendor)}>Subscribe</Button>
                  </div>

                  {/* Regular weekly menu for today */}
                  {todayMenu && (
                    <>
                      <MealCard vendorId={vendor._id} meal={todayMenu.lunch}  mealType='lunch'  icon='🌅' menuSource='weekly' />
                      <MealCard vendorId={vendor._id} meal={todayMenu.dinner} mealType='dinner' icon='🌙' menuSource='weekly' />
                    </>
                  )}

                  {/* Special menu for today (highlighted) */}
                  {specialMenu && (
                    <div className='mt-4 border-2 border-yellow-300 rounded-lg p-4 bg-yellow-50'>
                      <div className='flex items-center gap-2 mb-3'>
                        <span className='text-lg font-bold text-yellow-700'>⭐ Today's Special</span>
                        {specialMenu.note && <span className='text-sm text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full'>{specialMenu.note}</span>}
                      </div>
                      <MealCard vendorId={vendor._id} meal={specialMenu.lunch}  mealType='lunch'  icon='🌅' menuSource='special' />
                      <MealCard vendorId={vendor._id} meal={specialMenu.dinner} mealType='dinner' icon='🌙' menuSource='special' />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Today's Orders */}
          {myOrders.filter(o => new Date(o.date).toDateString() === new Date(selectedDate).toDateString()).length > 0 && (
            <div className='mt-8'>
              <h2 className='text-xl font-bold mb-4'>Your Orders for This Day</h2>
              <div className='space-y-3'>
                {myOrders
                  .filter(o => new Date(o.date).toDateString() === new Date(selectedDate).toDateString())
                  .map(order => (
                    <Card key={order._id} className='flex items-center justify-between'>
                      <div>
                        <p className='font-semibold'>{order.vendor?.shopName}</p>
                        <p className='text-sm text-gray-600 capitalize'>{order.mealType} · {order.preference} · ₹{order.price}
                          {order.menuSource === 'special' && <span className='ml-2 text-yellow-600'>⭐ Special</span>}
                        </p>
                      </div>
                      <div className='flex items-center gap-3'>
                        <Badge variant={order.status === 'cancelled' ? 'danger' : order.status === 'delivered' ? 'success' : 'warning'}>
                          {order.status}
                        </Badge>
                        {order.status === 'pending' && (
                          <Button size='sm' variant='danger' onClick={() => cancelOrder(order._id)}>Cancel</Button>
                        )}
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── WEEKLY MENU TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'weekly' && (
        <>
          <p className='text-sm text-gray-500 mb-6'>Browse each vendor's full weekly menu.</p>
          {allVendors.length === 0 ? (
            <Card><p className='text-center text-gray-500 py-8'>No vendors available.</p></Card>
          ) : (
            <div className='space-y-4'>
              {allVendors.map((vendor) => (
                <Card key={vendor._id}>
                  <button className='w-full flex items-center justify-between'
                    onClick={() => {
                      const next = expandedVendor === vendor._id ? null : vendor._id;
                      setExpandedVendor(next);
                      if (next) fetchVendorWeeklyMenu(vendor._id);
                    }}>
                    <div className='text-left'>
                      <p className='text-xl font-bold'>{vendor.shopName}</p>
                      <p className='text-gray-500 text-sm'>{vendor.description}</p>
                    </div>
                    <span>{expandedVendor === vendor._id ? '▲' : '▼'}</span>
                  </button>

                  {expandedVendor === vendor._id && (() => {
                    const wm = weeklyMenus[vendor._id];
                    if (!wm) return <p className='text-center py-4 text-gray-400 mt-4'>Loading…</p>;
                    return (
                      <div className='mt-4'>
                        {DAYS.map(day => {
                          const dayData = wm.days?.[day];
                          if (!dayData) return null;
                          return (
                            <div key={day} className='border rounded-lg p-4 mb-3'>
                              <h4 className='font-bold text-gray-800 mb-3'>{DAY_LABELS[day]}</h4>
                              {['lunch','dinner'].map(meal => {
                                const m = dayData[meal];
                                if (!m?.available) return null;
                                return (
                                  <div key={meal} className='mb-3'>
                                    <p className='font-semibold text-gray-700 mb-2'>
                                      {meal === 'lunch' ? '🌅 Lunch' : '🌙 Dinner'}
                                    </p>
                                    <div className='grid md:grid-cols-2 gap-3'>
                                      {m.veg?.items?.length > 0 && (
                                        <div className='text-sm bg-green-50 rounded p-3'>
                                          <p className='font-medium text-green-700 mb-1'>🥬 Veg · ₹{m.veg.price}</p>
                                          {m.veg.items.map((item, i) => <p key={i} className='text-gray-600'>• {item}</p>)}
                                        </div>
                                      )}
                                      {m.nonVeg?.items?.length > 0 && (
                                        <div className='text-sm bg-red-50 rounded p-3'>
                                          <p className='font-medium text-red-700 mb-1'>🍖 Non-Veg · ₹{m.nonVeg.price}</p>
                                          {m.nonVeg.items.map((item, i) => <p key={i} className='text-gray-600'>• {item}</p>)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <SubscribeModal vendor={showSubscribeModal} onClose={() => setShowSubscribeModal(null)} onSubscribe={createSubscription} />
      )}
    </div>
  );
}

function SubscribeModal({ vendor, onClose, onSubscribe }) {
  const [form, setForm] = useState({
    mealType:   'both',
    preference: 'veg',
    startDate:  new Date().toISOString().split('T')[0],
    endDate:    ''
  });

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50'>
      <Card className='max-w-md w-full'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='text-xl font-bold'>Subscribe to {vendor.shopName}</h3>
            <p className='text-sm text-gray-600'>Get meals automatically every day</p>
          </div>
          <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSubscribe(vendor._id, form); }} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Meal Type</label>
            <select value={form.mealType} onChange={e => setForm({...form, mealType: e.target.value})} className='w-full border rounded px-3 py-2' required>
              <option value='lunch'>Lunch Only</option>
              <option value='dinner'>Dinner Only</option>
              <option value='both'>Both Meals</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Preference</label>
            <select value={form.preference} onChange={e => setForm({...form, preference: e.target.value})} className='w-full border rounded px-3 py-2' required>
              <option value='veg'>Vegetarian</option>
              <option value='nonVeg'>Non-Vegetarian</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Start Date</label>
            <input type='date' value={form.startDate} min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm({...form, startDate: e.target.value})} className='w-full border rounded px-3 py-2' required />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>End Date (Optional)</label>
            <input type='date' value={form.endDate} min={form.startDate}
              onChange={e => setForm({...form, endDate: e.target.value})} className='w-full border rounded px-3 py-2' />
          </div>
          <div className='flex gap-3 pt-4'>
            <Button variant='secondary' onClick={onClose} type='button' className='flex-1'>Cancel</Button>
            <Button type='submit' className='flex-1'>Subscribe</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
