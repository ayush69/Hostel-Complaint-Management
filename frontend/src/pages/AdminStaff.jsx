import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

export default function AdminStaff(){
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  
  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/admin/staff?q=${encodeURIComponent(q)}`);
      setList(r.data.list || []);
    } catch(e) { /* ignore */ }
    finally { setLoading(false); }
  };
  
  useEffect(()=>{ load(); /* eslint-disable-next-line */ },[]);

  const categoryColors = {
    Electrician: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Plumber: 'bg-blue-100 text-blue-800 border-blue-200',
    Carpenter: 'bg-orange-100 text-orange-800 border-orange-200',
    Cleaner: 'bg-green-100 text-green-800 border-green-200',
    Maintenance: 'bg-purple-100 text-purple-800 border-purple-200',
    Other: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <AdminLayout
      title='Staff Management'
      breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Staff'}]}
      actions={
        <Link to='/admin/staff/create'>
          <Button variant='success'>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Staff
          </Button>
        </Link>
      }
    >
      {/* Search Bar */}
      <Card className="mb-6">
        <div className='flex items-center gap-4'>
          <div className="flex-1">
            <Input
              placeholder='Search by name or email...'
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

      {/* Staff List */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      ) : list.length === 0 ? (
        <Card className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No staff found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or create a new staff member</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {list.map(s=> (
            <Card key={s._id} className="hover:border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className='font-bold text-lg text-gray-900'>{s.name}</h3>
                      <p className='text-sm text-gray-600'>{s.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[s.category] || categoryColors.Other}`}>
                      {s.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Phone */}
                    {s.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{s.phoneNumber}</span>
                      </div>
                    )}

                    {/* Off Day */}
                    {s.offDay && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Off: {s.offDay}</span>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className='text-sm font-medium text-gray-700'>
                        {s.avgRating ? `${s.avgRating}/5` : 'No ratings'}
                      </span>
                      {s.ratingsCount > 0 && (
                        <span className='text-xs text-gray-500'>({s.ratingsCount} reviews)</span>
                      )}
                    </div>
                  </div>
                </div>

                <Link to={`/admin/staff/${s._id}/edit`}>
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
