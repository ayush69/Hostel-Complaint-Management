import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';

export default function AdminAssign() {
  const { id } = useParams();
  const nav = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [staff, setStaff] = useState([]);
  const [staffId, setStaffId] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadComplaint = async () => {
    try {
      const r = await api.get(`/complaints/${id}/details`);
      setComplaint(r.data.complaint);
    } catch (e) {
      toast.error('Failed to load complaint');
      nav('/admin/pending');
    }
  };

  const loadStaff = async (category) => {
    try {
      const r = await api.get(`/admin/staff?category=${encodeURIComponent(category || '')}`);
      setStaff(r.data.list || []);
    } catch (e) {
      toast.error('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (complaint?.category) loadStaff(complaint.category);
    // eslint-disable-next-line
  }, [complaint?.category]);

  const assign = async () => {
    if (!staffId) return toast.error('Please select a staff member');
    setBusy(true);
    try {
      await api.put(`/admin/complaints/${id}/assign`, { staffId });
      toast.success('Staff assigned successfully!');
      nav('/admin/pending');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error assigning staff');
    } finally {
      setBusy(false);
    }
  };

  if (loading || !complaint) {
    return (
      <AdminLayout title='Assign Complaint'>
        <Card className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </Card>
      </AdminLayout>
    );
  }

  const categoryIcons = {
    Electrician: '⚡',
    Plumber: '🔧',
    Carpenter: '🪛',
    Cleaner: '🧹',
    Maintenance: '🔨',
    Other: '📋'
  };

  return (
    <AdminLayout
      title='Assign Staff to Complaint'
      breadcrumb={[
        { label: 'Admin', to: '/admin/dashboard' },
        { label: 'Pending', to: '/admin/pending' },
        { label: 'Assign' }
      ]}
      actions={
        <Button variant='outline' onClick={() => nav(-1)}>
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Back
        </Button>
      }
    >
      {/* Complaint Details Card */}
      <Card className='mb-6'>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>Complaint Details</h3>
        <div className='flex items-start gap-4'>
          <div className='bg-blue-100 p-3 rounded-full'>
            <span className='text-2xl'>{categoryIcons[complaint.category] || '📋'}</span>
          </div>
          <div className='flex-1'>
            <h4 className='text-xl font-bold text-gray-900 mb-2'>{complaint.title}</h4>
            <div className='flex flex-wrap gap-2 mb-3'>
              <Badge variant='yellow'>Pending</Badge>
              <span className='text-sm text-gray-600'>{complaint.category}</span>
            </div>
            {complaint.description && (
              <p className='text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 mb-3'>
                {complaint.description}
              </p>
            )}
            <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
              <div className='flex items-center gap-1'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                </svg>
                Room {complaint.roomNo || 'N/A'}
              </div>
              {complaint.studentId && !complaint.isAnonymous && (
                <div className='flex items-center gap-1'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                  {complaint.studentId.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Staff Selection Card */}
      <Card>
        <h3 className='text-lg font-bold text-gray-900 mb-2'>Select Staff Member</h3>
        <p className='text-sm text-gray-600 mb-4'>
          Choose a staff member from the <strong>{complaint.category}</strong> category to assign this complaint.
        </p>

        {staff.length === 0 ? (
          <div className='text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200'>
            <svg className='w-12 h-12 text-yellow-600 mx-auto mb-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
            </svg>
            <h4 className='font-bold text-yellow-900 mb-1'>No Staff Available</h4>
            <p className='text-sm text-yellow-800'>
              No staff members found in the {complaint.category} category.
            </p>
          </div>
        ) : (
          <>
            <div className='relative mb-4'>
              <select
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-all text-gray-900'
                value={staffId}
                onChange={e => setStaffId(e.target.value)}
              >
                <option value=''>-- Choose a staff member --</option>
                {staff.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} • {s.category}
                    {s.offDay ? ` (Off: ${s.offDay})` : ''}
                    {s.avgRating ? ` ⭐ ${s.avgRating.toFixed(1)}` : ''}
                  </option>
                ))}
              </select>
              <svg className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </div>

            {/* Selected Staff Info */}
            {staffId && staff.find(s => s._id === staffId) && (
              <div className='mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                <h4 className='text-sm font-bold text-blue-900 mb-2'>Selected Staff:</h4>
                {(() => {
                  const selected = staff.find(s => s._id === staffId);
                  return (
                    <div className='flex items-center gap-3'>
                      <div className='bg-blue-100 p-2 rounded-full'>
                        <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                        </svg>
                      </div>
                      <div>
                        <div className='font-semibold text-blue-900'>{selected.name}</div>
                        <div className='text-sm text-blue-700'>
                          {selected.category}
                          {selected.avgRating ? ` • Rating: ${selected.avgRating.toFixed(1)}/5` : ''}
                          {selected.offDay ? ` • Off Day: ${selected.offDay}` : ''}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Assign Button */}
            <Button onClick={assign} loading={busy} disabled={!staffId} className='w-full md:w-auto'>
              <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              Assign to Selected Staff
            </Button>
          </>
        )}
      </Card>
    </AdminLayout>
  );
}
