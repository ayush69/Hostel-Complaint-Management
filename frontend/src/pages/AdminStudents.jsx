import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import toast from 'react-hot-toast';

export default function AdminStudents(){
  const [list, setList] = useState([]);
  const [page] = useState(1);
  const [per] = useState(50);
  const [fine, setFine] = useState({ studentId:'', amount:'', reason:'' });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/students?page=${page}&per=${per}&q=${encodeURIComponent(q)}`);
      setList(res.data.list || []);
    } catch (e) { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, per]);

  const impose = async (e) => {
    e.preventDefault();
    if (!fine.studentId || !fine.amount) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await api.post('/admin/fines/impose', { studentId: fine.studentId, amount: Number(fine.amount), reason: fine.reason });
      toast.success('Fine imposed successfully');
      setFine({ studentId:'', amount:'', reason:'' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error imposing fine');
    }
  };

  return (
    <AdminLayout
      title='Students Management'
      breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Students'}]}
      actions={<Button onClick={load} loading={loading}>Search</Button>}
    >
      {/* Search Bar */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or roll number..."
              value={q}
              onChange={e=>setQ(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && load()}
            />
          </div>
          <Button onClick={load} loading={loading}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Students ({list.length})</h3>
          {loading ? (
            [1,2,3].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))
          ) : list.length === 0 ? (
            <Card className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg">No students found</p>
            </Card>
          ) : (
            list.map(s => (
              <Card key={s._id} className="hover:border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{s.name}</h4>
                        <span className="text-sm text-gray-500">Roll No: {s.rollNo}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {s.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Room: {s.roomNo || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Branch: {s.branch || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Year: {s.year || 'N/A'}
                      </div>
                    </div>
                    {/* Fine Information */}
                    {s.fineStats && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {s.fineStats.unpaidFines > 0 ? (
                              <div className="flex items-center gap-2 text-red-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold">₹{s.fineStats.totalUnpaid} Unpaid</span>
                                <span className="text-xs bg-red-100 px-2 py-0.5 rounded-full">{s.fineStats.unpaidFines} fine{s.fineStats.unpaidFines !== 1 ? 's' : ''}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-green-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold">No Unpaid Fines</span>
                              </div>
                            )}
                            {s.fineStats.totalPaid > 0 && (
                              <span className="text-xs text-gray-500">
                                ₹{s.fineStats.totalPaid} paid
                              </span>
                            )}
                          </div>
                          {s.fineStats.totalFines > 0 && (
                            <Link to={`/admin/students/${s._id}/edit`}>
                              <Button variant="outline" size="sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Manage Fines
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to={`/admin/students/${s._id}/edit`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Student
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Fine Imposition Form */}
        <div>
          <Card className="sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Impose Fine</h3>
                <p className="text-xs text-gray-500">Add penalty to student</p>
              </div>
            </div>
            <form onSubmit={impose} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                <select
                  className="border border-gray-300 px-4 py-2.5 rounded-lg w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={fine.studentId}
                  onChange={e=>setFine({...fine,studentId:e.target.value})}
                  required
                >
                  <option value="">Choose a student...</option>
                  {list.map(s=> (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Amount (₹)"
                type="number"
                placeholder="Enter fine amount"
                value={fine.amount}
                onChange={e=>setFine({...fine,amount:e.target.value})}
                required
              />
              <Input
                label="Reason"
                placeholder="Enter reason for fine"
                value={fine.reason}
                onChange={e=>setFine({...fine,reason:e.target.value})}
                required
              />
              <Button variant='danger' className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Impose Fine
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
