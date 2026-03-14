import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const STATUS_VARIANTS = {
  pending:   'warning',
  confirmed: 'info',
  delivered: 'success',
  cancelled: 'danger',
};

export default function StudentTiffinHistory() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all'); // all | pending | confirmed | delivered | cancelled

  useEffect(() => {
    api.get('/tiffin/orders')
      .then(r => setOrders(r.data))
      .catch(() => toast.error('Failed to load order history'))
      .finally(() => setLoading(false));
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      await api.delete(`/tiffin/orders/${orderId}`);
      toast.success('Order cancelled');
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel order');
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className='p-6'>Loading…</div>;

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Order History</h1>
          <p className='text-gray-600 mt-1'>All your tiffin orders</p>
        </div>
        <Link to='/student/tiffin'>
          <Button variant='secondary'>← Back to Tiffin</Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className='flex flex-wrap gap-2 mb-6'>
        {[
          ['all',       'All',       orders.length],
          ['pending',   'Pending',   counts.pending   || 0],
          ['confirmed', 'Confirmed', counts.confirmed || 0],
          ['delivered', 'Delivered', counts.delivered || 0],
          ['cancelled', 'Cancelled', counts.cancelled || 0],
        ].map(([key, label, count]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
              ${filter === key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <Card><p className='text-center text-gray-500 py-10'>No orders found.</p></Card>
      ) : (
        <div className='space-y-3'>
          {filtered.map(order => (
            <Card key={order._id}>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap mb-1'>
                    <span className='font-bold text-gray-900'>{order.vendor?.shopName}</span>
                    <Badge variant={order.mealType === 'lunch' ? 'warning' : 'info'}>
                      {order.mealType === 'lunch' ? '🌅 Lunch' : '🌙 Dinner'}
                    </Badge>
                    <Badge variant={order.preference === 'veg' ? 'success' : 'danger'}>
                      {order.preference === 'veg' ? '🥬 Veg' : '🍖 Non-Veg'}
                    </Badge>
                    {order.menuSource === 'special' && (
                      <Badge variant='warning'>⭐ Special</Badge>
                    )}
                  </div>
                  <p className='text-sm text-gray-500'>
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                    })}
                    {' · '}Qty: {order.quantity}
                    {' · '}₹{order.price}
                  </p>
                  {order.rating && (
                    <p className='text-xs text-gray-400 mt-1'>
                      {'⭐'.repeat(order.rating)} {order.feedback && `— "${order.feedback}"`}
                    </p>
                  )}
                </div>
                <div className='flex items-center gap-2 shrink-0'>
                  <Badge variant={STATUS_VARIANTS[order.status] || 'default'}>
                    {order.status}
                  </Badge>
                  {order.status === 'pending' && (
                    <Button size='sm' variant='danger' onClick={() => cancelOrder(order._id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
