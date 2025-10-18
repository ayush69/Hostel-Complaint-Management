import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

export default function AdminComplaints(){
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/admin/complaints?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`);
      setList(r.data.list || []);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const getStatusBadgeClass = (st) => {
    const classes = {
      Pending: 'badge-pending',
      Assigned: 'badge-assigned',
      InProgress: 'badge-inprogress',
      Completed: 'badge-completed'
    };
    return `badge ${classes[st] || ''}`;
  };

  return (
    <AdminLayout
      title='All Complaints'
      breadcrumb={[{label: 'Admin', to: '/admin/dashboard'}, {label: 'Complaints'}]}
      actions={<Button variant='secondary' onClick={load} loading={loading}>Refresh</Button>}
    >
      {/* Filters */}
      <Card className="mb-6">
        <div className='flex flex-col md:flex-row gap-4'>
          <div className="flex-1">
            <Input
              placeholder='Search by title or student name...'
              value={q}
              onChange={e => setQ(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="md:w-48">
            <select
              className='border border-gray-300 px-4 py-2.5 rounded-lg w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value=''>All Status</option>
              <option value='Pending'>Pending</option>
              <option value='Assigned'>Assigned</option>
              <option value='InProgress'>In Progress</option>
              <option value='Completed'>Completed</option>
            </select>
          </div>
          <Button onClick={load} loading={loading}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </Button>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      ) : list.length === 0 ? (
        <Card className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg">No complaints found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map(c => (
            <Card key={c._id} className="hover:border-blue-200">
              <div className='flex flex-col md:flex-row justify-between gap-4'>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className='font-semibold text-lg text-gray-900'>{c.title}</h3>
                    <span className={getStatusBadgeClass(c.status)}>{c.status}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-medium">{c.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>
                        {c.studentId
                          ? `${c.studentId.name} (${c.studentId.rollNo})`
                          : c.studentName || 'Anonymous'}
                      </span>
                    </div>
                  </div>

                  {c.assignedStaffId && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Assigned to: <strong>{c.assignedStaffId.name}</strong> ({c.assignedStaffId.category})</span>
                    </div>
                  )}
                </div>

                {c.rating && (
                  <div className='flex flex-col items-end justify-center bg-gradient-to-br from-yellow-50 to-orange-50 px-6 py-4 rounded-lg border border-yellow-200'>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className='text-2xl font-bold text-gray-900'>{c.rating}/5</span>
                    </div>
                    {c.feedback && (
                      <p className='text-xs text-gray-600 max-w-xs text-right italic'>"{c.feedback}"</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
