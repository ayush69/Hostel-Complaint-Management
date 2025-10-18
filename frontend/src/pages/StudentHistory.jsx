import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function StudentHistory() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/complaints/student/history')
      .then(r => setList(r.data.list))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredList = filter === 'all'
    ? list
    : list.filter(c => c.status.toLowerCase() === filter.toLowerCase());

  const categoryIcons = {
    Electrician: '⚡',
    Plumber: '🔧',
    Carpenter: '🪛',
    Cleaner: '🧹',
    Maintenance: '🔨',
    Other: '📋'
  };

  const statusColors = {
    Pending: 'yellow',
    Assigned: 'blue',
    'In Progress': 'purple',
    Completed: 'green',
    Rejected: 'red'
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-5xl mx-auto'>
          <div className='h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse'></div>
          <div className='space-y-4'>
            {[1, 2, 3].map(i => (
              <Card key={i} className='animate-pulse'>
                <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Complaint History</h1>
            <p className='text-gray-600'>Track all your submitted complaints</p>
          </div>
          <Link to='/student/raise'>
            <Button className='mt-4 md:mt-0'>
              <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
              </svg>
              Raise New Complaint
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <Card className='mb-6'>
          <div className='flex flex-wrap gap-2'>
            {['all', 'Pending', 'Assigned', 'In Progress', 'Completed', 'Rejected'].map(status => (
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
                  ({status === 'all' ? list.length : list.filter(c => c.status.toLowerCase() === status.toLowerCase()).length})
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Complaints List */}
        {filteredList.length === 0 ? (
          <Card className='text-center py-12'>
            <div className='text-6xl mb-4'>📋</div>
            <h3 className='text-xl font-bold text-gray-900 mb-2'>
              {filter === 'all' ? 'No Complaints Yet' : `No ${filter} Complaints`}
            </h3>
            <p className='text-gray-600 mb-6'>
              {filter === 'all'
                ? "You haven't raised any complaints yet."
                : `You don't have any complaints with status "${filter}".`}
            </p>
            {filter === 'all' && (
              <Link to='/student/raise'>
                <Button>Raise Your First Complaint</Button>
              </Link>
            )}
            {filter !== 'all' && (
              <Button variant='outline' onClick={() => setFilter('all')}>
                Show All Complaints
              </Button>
            )}
          </Card>
        ) : (
          <div className='space-y-4'>
            {filteredList.map(c => (
              <Link to={`/complaints/${c._id}`} key={c._id}>
                <Card className='hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer'>
                  <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-start gap-3 mb-3'>
                        <span className='text-2xl'>{categoryIcons[c.category] || '📋'}</span>
                        <div className='flex-1'>
                          <h3 className='text-lg font-bold text-gray-900 mb-1'>{c.title}</h3>
                          <div className='flex flex-wrap gap-2 items-center'>
                            <Badge variant={statusColors[c.status] || 'default'}>
                              {c.status}
                            </Badge>
                            <span className='text-sm text-gray-500'>{c.category}</span>
                            {c.isAnonymous && (
                              <span className='text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full'>
                                🔒 Anonymous
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                        <div className='flex items-center gap-1'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                          </svg>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                        {c.roomNo && (
                          <div className='flex items-center gap-1'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                            </svg>
                            Room {c.roomNo}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <svg className='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
