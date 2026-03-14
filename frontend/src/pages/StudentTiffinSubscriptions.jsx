import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function StudentTiffinSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subsRes, ordersRes] = await Promise.all([
        api.get('/tiffin/subscriptions'),
        api.get('/tiffin/orders')
      ]);
      setSubscriptions(subsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (id, isActive) => {
    try {
      await api.put(`/tiffin/subscriptions/${id}`, { isActive });
      toast.success(isActive ? 'Subscription activated' : 'Subscription paused');
      fetchData();
    } catch (err) {
      toast.error('Failed to update subscription');
    }
  };

  const cancelSubscription = async (id) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    
    try {
      await api.delete(`/tiffin/subscriptions/${id}`);
      toast.success('Subscription cancelled');
      fetchData();
    } catch (err) {
      toast.error('Failed to cancel subscription');
    }
  };

  const cancelOrder = async (id) => {
    try {
      await api.delete(`/tiffin/orders/${id}`);
      toast.success('Order cancelled');
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>My Tiffin Subscriptions & Orders</h1>

      {/* Subscriptions */}
      <Card className='mb-6'>
        <h2 className='text-2xl font-bold mb-4'>Active Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p className='text-gray-500 text-center py-8'>No subscriptions yet</p>
        ) : (
          <div className='space-y-4'>
            {subscriptions.map(sub => (
              <div key={sub._id} className='border rounded-lg p-4 hover:bg-gray-50'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='text-xl font-bold'>{sub.vendor.shopName}</h3>
                    <div className='flex gap-4 mt-2 text-sm'>
                      <Badge variant={sub.mealType === 'both' ? 'info' : 'secondary'}>
                        {sub.mealType === 'both' ? 'Lunch & Dinner' : 
                         sub.mealType === 'lunch' ? 'Lunch Only' : 'Dinner Only'}
                      </Badge>
                      <Badge variant={sub.preference === 'veg' ? 'success' : 'danger'}>
                        {sub.preference === 'veg' ? '🥬 Veg' : '🍖 Non-Veg'}
                      </Badge>
                      <Badge variant={sub.isActive ? 'success' : 'warning'}>
                        {sub.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <p className='text-sm text-gray-600 mt-2'>
                      Started: {new Date(sub.startDate).toLocaleDateString()}
                      {sub.endDate && ` • Ends: ${new Date(sub.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant={sub.isActive ? 'warning' : 'success'}
                      onClick={() => toggleSubscription(sub._id, !sub.isActive)}
                    >
                      {sub.isActive ? 'Pause' : 'Resume'}
                    </Button>
                    <Button
                      size='sm'
                      variant='danger'
                      onClick={() => cancelSubscription(sub._id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Orders History */}
      <Card>
        <h2 className='text-2xl font-bold mb-4'>Order History</h2>
        {orders.length === 0 ? (
          <p className='text-gray-500 text-center py-8'>No orders yet</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left p-3'>Date</th>
                  <th className='text-left p-3'>Vendor</th>
                  <th className='text-left p-3'>Meal</th>
                  <th className='text-left p-3'>Type</th>
                  <th className='text-left p-3'>Price</th>
                  <th className='text-left p-3'>Status</th>
                  <th className='text-left p-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className='border-b hover:bg-gray-50'>
                    <td className='p-3'>
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className='p-3 font-medium'>{order.vendor.shopName}</td>
                    <td className='p-3'>
                      <Badge variant={order.mealType === 'lunch' ? 'warning' : 'info'}>
                        {order.mealType}
                      </Badge>
                    </td>
                    <td className='p-3'>
                      <Badge variant={order.preference === 'veg' ? 'success' : 'danger'}>
                        {order.preference === 'veg' ? '🥬 Veg' : '🍖 Non-Veg'}
                      </Badge>
                    </td>
                    <td className='p-3 font-medium'>₹{order.price}</td>
                    <td className='p-3'>
                      <Badge variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'confirmed' ? 'info' :
                        order.status === 'cancelled' ? 'danger' : 'secondary'
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className='p-3'>
                      {order.status === 'pending' && (
                        <Button
                          size='sm'
                          variant='danger'
                          onClick={() => cancelOrder(order._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
