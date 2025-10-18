import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';

export default function StaffDashboard() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [changeId, setChangeId] = useState(null);
  const [newStatus, setNewStatus] = useState('InProgress');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    try {
      const r = await api.get(`/staff/assigned-complaints${statusFilter ? `?status=${statusFilter}` : ''}`);
      setTasks(r.data.list || []);
    } catch (e) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [statusFilter]);

  const update = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/staff/complaints/${id}/update-status`, { status });
      toast.success('Status updated successfully!');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    Pending: 'yellow',
    Assigned: 'blue',
    InProgress: 'purple',
    Completed: 'green'
  };

  const categoryIcons = {
    Electrician: '⚡',
    Plumber: '🔧',
    Carpenter: '🪛',
    Cleaner: '🧹',
    Maintenance: '🔨',
    Other: '📋'
  };

  const stats = [
    {
      label: 'Assigned',
      count: tasks.filter(t => t.status === 'Assigned').length,
      color: 'blue',
      icon: '📋'
    },
    {
      label: 'In Progress',
      count: tasks.filter(t => t.status === 'InProgress').length,
      color: 'purple',
      icon: '⏳'
    },
    {
      label: 'Completed',
      count: tasks.filter(t => t.status === 'Completed').length,
      color: 'green',
      icon: '✅'
    }
  ];

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            {[1, 2, 3].map(i => (
              <Card key={i} className='animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
                <div className='h-8 bg-gray-200 rounded w-1/3'></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Staff Dashboard</h1>
          <p className='text-gray-600'>Manage your assigned complaints and tasks</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          {stats.map((stat, idx) => (
            <Card key={idx} className='hover:shadow-lg transition-shadow cursor-pointer' onClick={() => setStatusFilter(stat.label === 'Assigned' ? 'Assigned' : stat.label === 'In Progress' ? 'InProgress' : 'Completed')}>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600 font-semibold mb-1'>{stat.label}</p>
                  <p className='text-3xl font-bold text-gray-900'>{stat.count}</p>
                </div>
                <div className={`text-4xl`}>{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter Bar */}
        <Card className='mb-6'>
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
            <h3 className='text-lg font-bold text-gray-900'>Your Tasks</h3>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium text-gray-700'>Filter:</label>
              <select
                className='px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer transition-all'
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value=''>All Tasks</option>
                <option value='Pending'>Pending</option>
                <option value='Assigned'>Assigned</option>
                <option value='InProgress'>In Progress</option>
                <option value='Completed'>Completed</option>
              </select>
              {statusFilter && (
                <Button variant='outline' onClick={() => setStatusFilter('')}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <Card className='text-center py-12'>
            <div className='text-6xl mb-4'>📭</div>
            <h3 className='text-xl font-bold text-gray-900 mb-2'>No Tasks Found</h3>
            <p className='text-gray-600'>
              {statusFilter
                ? `You don't have any ${statusFilter.toLowerCase()} tasks.`
                : "You don't have any assigned tasks yet."}
            </p>
          </Card>
        ) : (
          <div className='space-y-4'>
            {tasks.map(t => (
              <Card key={t._id} className='hover:shadow-lg transition-shadow'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-start gap-3 mb-3'>
                      <span className='text-2xl'>{categoryIcons[t.category] || '📋'}</span>
                      <div className='flex-1'>
                        <h3 className='text-lg font-bold text-gray-900 mb-1'>{t.title}</h3>
                        <div className='flex flex-wrap gap-2 items-center mb-2'>
                          <Badge variant={statusColors[t.status] || 'default'}>
                            {t.status === 'InProgress' ? 'In Progress' : t.status}
                          </Badge>
                          <span className='text-sm text-gray-500'>{t.category}</span>
                        </div>
                        <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                          <div className='flex items-center gap-1'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                            </svg>
                            Room {t.roomNo || 'N/A'}
                          </div>
                          {t.studentId && !t.isAnonymous && (
                            <div className='flex items-center gap-1'>
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                              </svg>
                              {t.studentId.name}
                            </div>
                          )}
                        </div>
                        {t.description && (
                          <p className='text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded border border-gray-200'>
                            {t.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-col gap-2 md:ml-4'>
                    {t.status === 'Assigned' && (
                      <Button
                        variant='primary'
                        onClick={() => update(t._id, 'InProgress')}
                        loading={updating}
                      >
                        <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        Start Task
                      </Button>
                    )}
                    {t.status === 'InProgress' && (
                      <Button
                        variant='success'
                        onClick={() => update(t._id, 'Completed')}
                        loading={updating}
                      >
                        <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        Mark Completed
                      </Button>
                    )}
                    {t.status === 'Completed' && (
                      <div className='flex flex-col gap-2'>
                        {changeId !== t._id ? (
                          <Button
                            variant='outline'
                            onClick={() => {
                              setChangeId(t._id);
                              setNewStatus('InProgress');
                            }}
                          >
                            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                            </svg>
                            Change Status
                          </Button>
                        ) : (
                          <Card className='p-3 bg-gray-50'>
                            <label className='text-xs font-semibold text-gray-700 mb-2 block'>
                              New Status:
                            </label>
                            <select
                              className='w-full px-3 py-2 border-2 border-gray-200 rounded-lg mb-2 text-sm'
                              value={newStatus}
                              onChange={e => setNewStatus(e.target.value)}
                            >
                              <option value='InProgress'>In Progress</option>
                              <option value='Assigned'>Assigned</option>
                            </select>
                            <div className='flex gap-2'>
                              <Button
                                size='sm'
                                onClick={async () => {
                                  await update(t._id, newStatus);
                                  setChangeId(null);
                                }}
                                loading={updating}
                              >
                                Update
                              </Button>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => setChangeId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
