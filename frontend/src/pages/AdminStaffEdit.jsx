import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

export default function AdminStaffEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await api.get(`/admin/staff/${id}`);
        setForm(r.data.staff);
      } catch (e) {
        toast.error('Failed to load staff details');
        nav('/admin/staff');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await api.put(`/admin/staff/${id}`, form);
      toast.success('Staff details updated successfully!');
      nav('/admin/staff');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving changes');
    } finally {
      setBusy(false);
    }
  };

  if (loading || !form) {
    return (
      <AdminLayout title='Edit Staff'>
        <Card className='animate-pulse max-w-2xl'>
          <div className='h-8 bg-gray-200 rounded mb-4'></div>
          <div className='space-y-3'>
            <div className='h-12 bg-gray-200 rounded'></div>
            <div className='h-12 bg-gray-200 rounded'></div>
            <div className='h-12 bg-gray-200 rounded'></div>
          </div>
        </Card>
      </AdminLayout>
    );
  }

  const categories = [
    { value: 'Electrician', icon: '⚡' },
    { value: 'Plumber', icon: '🔧' },
    { value: 'Carpenter', icon: '🪛' },
    { value: 'Cleaner', icon: '🧹' },
    { value: 'Maintenance', icon: '🔨' },
    { value: 'Other', icon: '📋' }
  ];

  return (
    <AdminLayout
      title='Edit Staff Member'
      breadcrumb={[
        { label: 'Admin', to: '/admin/dashboard' },
        { label: 'Staff', to: '/admin/staff' },
        { label: 'Edit' }
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
      <div className='max-w-2xl'>
        <Card>
          <div className='flex items-center gap-3 mb-6'>
            <div className='bg-blue-100 p-3 rounded-full'>
              <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
              </svg>
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900'>Edit Staff Information</h2>
              <p className='text-sm text-gray-600'>Update staff member details</p>
            </div>
          </div>

          <form onSubmit={submit} className='space-y-6'>
            {/* Personal Information */}
            <div>
              <h3 className='text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide'>
                Personal Information
              </h3>
              <div className='space-y-4'>
                <Input
                  label='Full Name'
                  placeholder='Enter staff name'
                  value={form.name || ''}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />

                <Input
                  label='Email Address'
                  type='email'
                  placeholder='staff@example.com'
                  value={form.email || ''}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />

                <Input
                  label='Phone Number'
                  type='tel'
                  placeholder='+91 XXXXXXXXXX'
                  value={form.phoneNumber || ''}
                  onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Work Details */}
            <div>
              <h3 className='text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide'>
                Work Details
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Category / Department
                  </label>
                  <div className='relative'>
                    <select
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-all'
                      value={form.category || 'Other'}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.value}
                        </option>
                      ))}
                    </select>
                    <svg className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </div>
                </div>

                <Input
                  label='Off Day (Optional)'
                  placeholder='e.g., Sunday, Monday'
                  value={form.offDay || ''}
                  onChange={e => setForm({ ...form, offDay: e.target.value })}
                />

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Address (Optional)
                  </label>
                  <textarea
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                    rows={3}
                    placeholder='Enter address'
                    value={form.address || ''}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className='border-t border-gray-200 pt-4'>
              <label className='flex items-start gap-3 cursor-pointer p-4 bg-red-50 rounded-lg border-2 border-red-200 hover:bg-red-100 transition-colors'>
                <input
                  type='checkbox'
                  checked={!!form.deleted}
                  onChange={e => setForm({ ...form, deleted: e.target.checked })}
                  className='mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500 cursor-pointer'
                />
                <div>
                  <span className='font-semibold text-red-900'>Mark as Deleted</span>
                  <p className='text-sm text-red-700 mt-1'>
                    This will deactivate the staff member's account and prevent them from logging in.
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className='flex gap-3 pt-4 border-t border-gray-200'>
              <Button loading={busy} className='flex-1'>
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                Save Changes
              </Button>
              <Button type='button' variant='outline' onClick={() => nav('/admin/staff')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}
