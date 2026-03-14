import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function VendorOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, vegCount: 0, nonVegCount: 0, deliveredCount: 0, cancelledCount: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Default: last 30 days
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tiffin/vendor/orders/history', {
        params: { startDate, endDate, page, limit: 20 }
      });
      setOrders(res.data.orders);
      setStats(res.data.stats);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setPage(1);
    fetchHistory();
  };

  const statusColor = (s) => {
    switch (s) {
      case 'delivered': return 'success';
      case 'confirmed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Order History</h1>
        <p className='text-gray-600 mt-1'>View and filter your past orders</p>
      </div>

      {/* Date Filters */}
      <Card className='mb-6'>
        <div className='flex flex-wrap items-end gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Start Date</label>
            <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)}
              className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>End Date</label>
            <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)}
              className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none' />
          </div>
          <Button onClick={handleFilter}>🔍 Filter</Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6'>
        <Card>
          <p className='text-2xl font-bold text-blue-600'>{stats.totalOrders}</p>
          <p className='text-xs text-gray-500 mt-1'>Total Orders</p>
        </Card>
        <Card>
          <p className='text-2xl font-bold text-green-600'>₹{stats.totalRevenue}</p>
          <p className='text-xs text-gray-500 mt-1'>Revenue</p>
        </Card>
        <Card>
          <p className='text-2xl font-bold text-emerald-600'>{stats.vegCount}</p>
          <p className='text-xs text-gray-500 mt-1'>🥬 Veg</p>
        </Card>
        <Card>
          <p className='text-2xl font-bold text-red-600'>{stats.nonVegCount}</p>
          <p className='text-xs text-gray-500 mt-1'>🍖 Non-Veg</p>
        </Card>
        <Card>
          <p className='text-2xl font-bold text-teal-600'>{stats.deliveredCount}</p>
          <p className='text-xs text-gray-500 mt-1'>✅ Delivered</p>
        </Card>
        <Card>
          <p className='text-2xl font-bold text-orange-600'>{stats.cancelledCount}</p>
          <p className='text-xs text-gray-500 mt-1'>❌ Cancelled</p>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>Orders ({total})</h3>
          {totalPages > 1 && (
            <p className='text-sm text-gray-500'>Page {page} of {totalPages}</p>
          )}
        </div>

        {loading ? (
          <p className='text-center text-gray-500 py-8'>Loading...</p>
        ) : orders.length === 0 ? (
          <p className='text-gray-500 text-center py-8'>No orders found for the selected date range</p>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left p-3 text-sm font-semibold text-gray-600'>Date</th>
                    <th className='text-left p-3 text-sm font-semibold text-gray-600'>Student</th>
                    <th className='text-left p-3 text-sm font-semibold text-gray-600'>Room</th>
                    <th className='text-left p-3 text-sm font-semibold text-gray-600'>Meal</th>
                    <th className='text-left p-3 text-sm font-semibold text-gray-600'>Type</th>
                    <th className='text-left p-3 text-sm font-semibold text-gray-600'>Qty</th>
                    <th className='text-left p-3 text-sm font-semibold text-gray-600'>Price</th>
                    <th className='text-left p-3 text-sm font-semibold text-gray-600'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className='border-b hover:bg-gray-50'>
                      <td className='p-3 text-sm'>
                        {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className='p-3'>
                        <div>
                          <p className='font-medium text-sm'>{order.student?.name || 'N/A'}</p>
                          <p className='text-xs text-gray-500'>{order.student?.rollNo}</p>
                        </div>
                      </td>
                      <td className='p-3 text-sm'>{order.student?.room || '-'}</td>
                      <td className='p-3'>
                        <Badge variant={order.mealType === 'lunch' ? 'warning' : 'info'}>
                          {order.mealType}
                        </Badge>
                      </td>
                      <td className='p-3'>
                        <div className='flex flex-col gap-1'>
                          <Badge variant={order.preference === 'veg' ? 'success' : 'danger'}>
                            {order.preference === 'veg' ? '🥬 Veg' : '🍖 Non-Veg'}
                          </Badge>
                          {order.menuSource === 'special' && (
                            <Badge variant='warning'>⭐ Special</Badge>
                          )}
                        </div>
                      </td>
                      <td className='p-3 text-sm'>{order.quantity}</td>
                      <td className='p-3 text-sm font-medium'>₹{order.price}</td>
                      <td className='p-3'>
                        <Badge variant={statusColor(order.status)}>{order.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center gap-2 mt-4 pt-4 border-t'>
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  if (p > totalPages) return null;
                  return (
                    <Button
                      key={p}
                      variant={p === page ? 'primary' : 'secondary'}
                      size='sm'
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  );
                })}
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
