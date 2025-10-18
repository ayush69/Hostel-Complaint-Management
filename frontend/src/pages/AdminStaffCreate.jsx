import React, { useState } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import toast from 'react-hot-toast';

export default function AdminStaffCreate() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'password123',
    category: 'Electrician',
    phoneNumber: '',
    address: '',
    offDay: ''
  });
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Name is required';
    if (!form.email?.trim()) newErrors.email = 'Email is required';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate() || busy) return;

    setBusy(true);
    try {
      await api.post('/auth/admin/create-staff', form);
      toast.success('Staff member created successfully!');
      setForm({
        name: '',
        email: '',
        password: 'password123',
        category: 'Electrician',
        phoneNumber: '',
        address: '',
        offDay: ''
      });
      setErrors({});
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error creating staff');
    } finally {
      setBusy(false);
    }
  };

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
      title='Create Staff Member'
      breadcrumb={[
        { label: 'Admin', to: '/admin/dashboard' },
        { label: 'Staff', to: '/admin/staff' },
        { label: 'Create' }
      ]}
    >
      <div className='max-w-2xl'>
        <Card>
          <div className='flex items-center gap-3 mb-6'>
            <div className='bg-green-100 p-3 rounded-full'>
              <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' />
              </svg>
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900'>Add New Staff Member</h2>
              <p className='text-sm text-gray-600'>Fill in the details to create a new staff account</p>
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
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                />

                <Input
                  label='Email Address'
                  type='email'
                  placeholder='staff@example.com'
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                />

                <Input
                  label='Password'
                  type='password'
                  placeholder='Minimum 6 characters'
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                />

                <Input
                  label='Phone Number'
                  type='tel'
                  placeholder='+91 XXXXXXXXXX'
                  value={form.phoneNumber}
                  onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                  error={errors.phoneNumber}
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
                      value={form.category}
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
                  value={form.offDay}
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
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex gap-3 pt-4 border-t border-gray-200'>
              <Button variant='success' loading={busy} className='flex-1'>
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Create Staff Member
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() =>
                  setForm({
                    name: '',
                    email: '',
                    password: 'password123',
                    category: 'Electrician',
                    phoneNumber: '',
                    address: '',
                    offDay: ''
                  })
                }
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Card */}
        <Card className='mt-6 bg-blue-50 border-blue-200'>
          <div className='flex items-start gap-3'>
            <svg className='w-5 h-5 text-blue-600 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <div>
              <h4 className='font-semibold text-blue-900 mb-1'>Note</h4>
              <p className='text-sm text-blue-800'>
                The staff member will receive their login credentials via email. They can change their password after first login.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
