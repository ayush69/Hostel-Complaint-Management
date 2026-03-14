import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function VendorDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ lunch: { veg: 0, nonVeg: 0, specialVeg: 0, specialNonVeg: 0 }, dinner: { veg: 0, nonVeg: 0, specialVeg: 0, specialNonVeg: 0 } });
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState('all');

  useEffect(() => {
    fetchTodayOrders();
  }, []);

  const fetchTodayOrders = async () => {
    try {
      const res = await api.get('/tiffin/vendor/orders/today');
      setOrders(res.data);
      
      // Calculate stats
      const lunchVeg        = res.data.filter(o => o.mealType === 'lunch'  && o.preference === 'veg'    && o.menuSource !== 'special').length;
      const lunchNonVeg     = res.data.filter(o => o.mealType === 'lunch'  && o.preference === 'nonVeg' && o.menuSource !== 'special').length;
      const lunchSpecialVeg    = res.data.filter(o => o.mealType === 'lunch'  && o.preference === 'veg'    && o.menuSource === 'special').length;
      const lunchSpecialNonVeg = res.data.filter(o => o.mealType === 'lunch'  && o.preference === 'nonVeg' && o.menuSource === 'special').length;
      const dinnerVeg       = res.data.filter(o => o.mealType === 'dinner' && o.preference === 'veg'    && o.menuSource !== 'special').length;
      const dinnerNonVeg    = res.data.filter(o => o.mealType === 'dinner' && o.preference === 'nonVeg' && o.menuSource !== 'special').length;
      const dinnerSpecialVeg    = res.data.filter(o => o.mealType === 'dinner' && o.preference === 'veg'    && o.menuSource === 'special').length;
      const dinnerSpecialNonVeg = res.data.filter(o => o.mealType === 'dinner' && o.preference === 'nonVeg' && o.menuSource === 'special').length;

      setStats({
        lunch:  { veg: lunchVeg,  nonVeg: lunchNonVeg,  specialVeg: lunchSpecialVeg,  specialNonVeg: lunchSpecialNonVeg  },
        dinner: { veg: dinnerVeg, nonVeg: dinnerNonVeg, specialVeg: dinnerSpecialVeg, specialNonVeg: dinnerSpecialNonVeg }
      });
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/tiffin/vendor/orders/${orderId}`, { status });
      toast.success('Order updated');
      fetchTodayOrders();
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const filteredOrders = selectedMeal === 'all'
    ? orders
    : selectedMeal === 'special'
      ? orders.filter(o => o.menuSource === 'special')
      : orders.filter(o => o.mealType === selectedMeal);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Today's Orders</h1>
        <p className='text-gray-600 mt-1'>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <Card>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            <span className='text-2xl'>🌅</span> Lunch Orders
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-green-50 p-4 rounded-lg'>
              <p className='text-2xl font-bold text-green-600'>{stats.lunch.veg}</p>
              <p className='text-sm text-gray-600'>Veg</p>
              {stats.lunch.specialVeg > 0 && <p className='text-xs text-yellow-600 mt-1'>+{stats.lunch.specialVeg} ⭐ Special</p>}
            </div>
            <div className='bg-red-50 p-4 rounded-lg'>
              <p className='text-2xl font-bold text-red-600'>{stats.lunch.nonVeg}</p>
              <p className='text-sm text-gray-600'>Non-Veg</p>
              {stats.lunch.specialNonVeg > 0 && <p className='text-xs text-yellow-600 mt-1'>+{stats.lunch.specialNonVeg} ⭐ Special</p>}
            </div>
          </div>
          <p className='mt-3 text-sm text-gray-500'>
            Total: <span className='font-semibold'>{stats.lunch.veg + stats.lunch.nonVeg + stats.lunch.specialVeg + stats.lunch.specialNonVeg}</span> orders
          </p>
        </Card>

        <Card>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            <span className='text-2xl'>🌙</span> Dinner Orders
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-green-50 p-4 rounded-lg'>
              <p className='text-2xl font-bold text-green-600'>{stats.dinner.veg}</p>
              <p className='text-sm text-gray-600'>Veg</p>
              {stats.dinner.specialVeg > 0 && <p className='text-xs text-yellow-600 mt-1'>+{stats.dinner.specialVeg} ⭐ Special</p>}
            </div>
            <div className='bg-red-50 p-4 rounded-lg'>
              <p className='text-2xl font-bold text-red-600'>{stats.dinner.nonVeg}</p>
              <p className='text-sm text-gray-600'>Non-Veg</p>
              {stats.dinner.specialNonVeg > 0 && <p className='text-xs text-yellow-600 mt-1'>+{stats.dinner.specialNonVeg} ⭐ Special</p>}
            </div>
          </div>
          <p className='mt-3 text-sm text-gray-500'>
            Total: <span className='font-semibold'>{stats.dinner.veg + stats.dinner.nonVeg + stats.dinner.specialVeg + stats.dinner.specialNonVeg}</span> orders
          </p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className='flex gap-2 mb-4'>
        <Button 
          variant={selectedMeal === 'all' ? 'primary' : 'secondary'}
          onClick={() => setSelectedMeal('all')}
        >
          All ({orders.length})
        </Button>
        <Button 
          variant={selectedMeal === 'lunch' ? 'primary' : 'secondary'}
          onClick={() => setSelectedMeal('lunch')}
        >
          Lunch ({stats.lunch.veg + stats.lunch.nonVeg + stats.lunch.specialVeg + stats.lunch.specialNonVeg})
        </Button>
        <Button 
          variant={selectedMeal === 'dinner' ? 'primary' : 'secondary'}
          onClick={() => setSelectedMeal('dinner')}
        >
          Dinner ({stats.dinner.veg + stats.dinner.nonVeg + stats.dinner.specialVeg + stats.dinner.specialNonVeg})
        </Button>
        {orders.filter(o => o.menuSource === 'special').length > 0 && (
          <Button
            variant={selectedMeal === 'special' ? 'primary' : 'secondary'}
            onClick={() => setSelectedMeal('special')}
          >
            ⭐ Special ({orders.filter(o => o.menuSource === 'special').length})
          </Button>
        )}
      </div>

      {/* Orders List */}
      <Card>
        <h3 className='text-lg font-semibold mb-4'>Order Details</h3>
        {filteredOrders.length === 0 ? (
          <p className='text-gray-500 text-center py-8'>No orders for selected filter</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left p-3'>Student</th>
                  <th className='text-left p-3'>Room</th>
                  <th className='text-left p-3'>Phone</th>
                  <th className='text-left p-3'>Meal</th>
                  <th className='text-left p-3'>Type</th>
                  <th className='text-left p-3'>Qty</th>
                  <th className='text-left p-3'>Status</th>
                  <th className='text-left p-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} className='border-b hover:bg-gray-50'>
                    <td className='p-3'>
                      <div>
                        <p className='font-medium'>{order.student.name}</p>
                        <p className='text-xs text-gray-500'>{order.student.rollNo}</p>
                      </div>
                    </td>
                    <td className='p-3'>{order.student.room}</td>
                    <td className='p-3 text-sm'>{order.student.phone}</td>
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
                    <td className='p-3'>{order.quantity}</td>
                    <td className='p-3'>
                      <Badge variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'confirmed' ? 'info' : 'secondary'
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className='p-3'>
                      <div className='flex gap-2'>
                        {order.status === 'pending' && (
                          <Button 
                            size='sm' 
                            onClick={() => updateOrderStatus(order._id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button 
                            size='sm' 
                            variant='success'
                            onClick={() => updateOrderStatus(order._id, 'delivered')}
                          >
                            Delivered
                          </Button>
                        )}
                      </div>
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
