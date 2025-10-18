import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function StudentFines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/student/fines')
      .then(r => setFines(r.data.fines))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredFines = filter === 'all'
    ? fines
    : fines.filter(f => f.status.toLowerCase() === filter.toLowerCase());

  const totalUnpaid = fines
    .filter(f => f.status.toLowerCase() === 'unpaid')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPaid = fines
    .filter(f => f.status.toLowerCase() === 'paid')
    .reduce((sum, f) => sum + f.amount, 0);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-5xl mx-auto'>
          <div className='h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <Card className='animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
              <div className='h-8 bg-gray-200 rounded w-3/4'></div>
            </Card>
            <Card className='animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
              <div className='h-8 bg-gray-200 rounded w-3/4'></div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Your Fines</h1>
          <p className='text-gray-600'>Track and manage your fines</p>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <Card className='bg-red-50 border-red-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-red-600 font-semibold mb-1'>Unpaid Fines</p>
                <p className='text-3xl font-bold text-red-700'>₹{totalUnpaid}</p>
              </div>
              <div className='bg-red-100 p-3 rounded-full'>
                <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
          </Card>

          <Card className='bg-green-50 border-green-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-green-600 font-semibold mb-1'>Paid Fines</p>
                <p className='text-3xl font-bold text-green-700'>₹{totalPaid}</p>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
          </Card>

          <Card className='bg-blue-50 border-blue-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-blue-600 font-semibold mb-1'>Total Fines</p>
                <p className='text-3xl font-bold text-blue-700'>{fines.length}</p>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className='mb-6'>
          <div className='flex flex-wrap gap-2'>
            {['all', 'Unpaid', 'Paid'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status}
                <span className='ml-2 text-xs opacity-75'>
                  ({status === 'all' ? fines.length : fines.filter(f => f.status.toLowerCase() === status.toLowerCase()).length})
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Fines List */}
        {filteredFines.length === 0 ? (
          <Card className='text-center py-12'>
            <div className='text-6xl mb-4'>💰</div>
            <h3 className='text-xl font-bold text-gray-900 mb-2'>
              {filter === 'all' ? 'No Fines' : `No ${filter} Fines`}
            </h3>
            <p className='text-gray-600'>
              {filter === 'all'
                ? 'Great! You have no fines.'
                : `You don't have any ${filter.toLowerCase()} fines.`}
            </p>
          </Card>
        ) : (
          <Card>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b-2 border-gray-200'>
                    <th className='text-left py-4 px-4 font-bold text-gray-700'>Date</th>
                    <th className='text-left py-4 px-4 font-bold text-gray-700'>Reason</th>
                    <th className='text-left py-4 px-4 font-bold text-gray-700'>Amount</th>
                    <th className='text-left py-4 px-4 font-bold text-gray-700'>Imposed By</th>
                    <th className='text-left py-4 px-4 font-bold text-gray-700'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFines.map(f => (
                    <tr key={f._id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                      <td className='py-4 px-4 text-gray-600 text-sm'>
                        {new Date(f.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className='py-4 px-4'>
                        <div className='font-medium text-gray-900'>{f.reason}</div>
                      </td>
                      <td className='py-4 px-4'>
                        <div className='font-bold text-lg text-gray-900'>₹{f.amount}</div>
                      </td>
                      <td className='py-4 px-4'>
                        <div className='flex items-center gap-2'>
                          <div className='bg-blue-100 p-2 rounded-full'>
                            <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                            </svg>
                          </div>
                          <span className='text-sm text-gray-700'>{f.imposedBy?.name || 'Admin'}</span>
                        </div>
                      </td>
                      <td className='py-4 px-4'>
                        <Badge variant={f.status.toLowerCase() === 'paid' ? 'green' : 'red'}>
                          {f.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Warning Message for Unpaid Fines */}
        {totalUnpaid > 0 && (
          <Card className='mt-6 bg-yellow-50 border-yellow-300'>
            <div className='flex items-start gap-3'>
              <svg className='w-6 h-6 text-yellow-600 mt-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
              </svg>
              <div>
                <h4 className='font-bold text-yellow-900 mb-1'>Payment Required</h4>
                <p className='text-sm text-yellow-800'>
                  You have <span className='font-bold'>₹{totalUnpaid}</span> in unpaid fines. Please contact the admin office to make payment.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
