import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

export default function StudentDashboard() {
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/dashboard')
      .then(r => setS(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className='animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-8 bg-gray-200 rounded w-1/2'></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!s) return null;

  const stats = [
    { label: 'Total Complaints', value: s.total, icon: '📋', color: 'blue', link: '/student/history' },
    { label: 'Pending', value: s.pending, icon: '⏳', color: 'yellow', link: '/student/history' },
    { label: 'Completed', value: s.completed, icon: '✅', color: 'green', link: '/student/history' },
    { label: 'Unpaid Fines', value: s.unpaid, icon: '💰', color: 'red', link: '/student/fines' }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back!</h1>
            <p className='text-gray-600'>Here's an overview of your complaints and fines</p>
          </div>
          <div className='flex gap-3 mt-4 md:mt-0'>
            <Link to='/student/raise'>
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Raise Complaint
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {stats.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <Card className='hover:border-blue-300 cursor-pointer transition-all'>
                <div className='flex items-center justify-between mb-4'>
                  <span className='text-3xl'>{stat.icon}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClasses[stat.color]} border`}>
                    {stat.value}
                  </div>
                </div>
                <h3 className='text-gray-600 text-sm font-medium mb-2'>{stat.label}</h3>
                <div className='text-3xl font-bold text-gray-900'>{stat.value}</div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className='text-lg font-bold text-gray-900 mb-6'>Quick Actions</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Link to='/student/raise' className='p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group'>
              <div className='flex flex-col items-center text-center gap-3'>
                <div className='bg-green-100 p-4 rounded-xl group-hover:bg-green-600 transition-colors'>
                  <svg className='w-8 h-8 text-green-600 group-hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                </div>
                <div>
                  <div className='font-semibold text-gray-900 text-lg mb-1'>Raise Complaint</div>
                  <div className='text-sm text-gray-500'>Report a new issue</div>
                </div>
              </div>
            </Link>

            <Link to='/student/history' className='p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group'>
              <div className='flex flex-col items-center text-center gap-3'>
                <div className='bg-blue-100 p-4 rounded-xl group-hover:bg-blue-600 transition-colors'>
                  <svg className='w-8 h-8 text-blue-600 group-hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div>
                  <div className='font-semibold text-gray-900 text-lg mb-1'>View History</div>
                  <div className='text-sm text-gray-500'>Track your complaints</div>
                </div>
              </div>
            </Link>

            <Link to='/student/fines' className='p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group'>
              <div className='flex flex-col items-center text-center gap-3'>
                <div className='bg-purple-100 p-4 rounded-xl group-hover:bg-purple-600 transition-colors'>
                  <svg className='w-8 h-8 text-purple-600 group-hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div>
                  <div className='font-semibold text-gray-900 text-lg mb-1'>Check Fines</div>
                  <div className='text-sm text-gray-500'>View pending payments</div>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
