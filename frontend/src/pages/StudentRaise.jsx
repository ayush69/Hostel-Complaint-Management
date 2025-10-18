import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import toast from 'react-hot-toast';

export default function StudentRaise() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Electrician',
    isAnonymous: false,
    roomNo: ''
  });
  const [errors, setErrors] = useState({});
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.title?.trim()) newErrors.title = 'Title is required';
    if (!form.description?.trim()) newErrors.description = 'Description is required';
    if (!form.roomNo?.trim()) newErrors.roomNo = 'Room number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setBusy(true);
    try {
      await api.post('/complaints/raise', form);
      toast.success('Complaint raised successfully!');
      nav('/student/history');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error raising complaint');
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
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
            <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Raise a Complaint</h1>
          <p className='text-gray-600'>Tell us what needs attention and we'll get it resolved quickly</p>
        </div>

        {/* Form Card */}
        <Card className='shadow-xl'>
          <form onSubmit={submit} className='space-y-6'>
            {/* Title */}
            <Input
              label='Complaint Title'
              placeholder='Brief summary of your issue'
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              error={errors.title}
            />

            {/* Description */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Description
              </label>
              <textarea
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder='Provide detailed information about the issue...'
                rows={5}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              ></textarea>
              {errors.description && (
                <p className='text-red-600 text-sm mt-1'>{errors.description}</p>
              )}
            </div>

            {/* Category & Room No */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Category */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Category
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

              {/* Room No */}
              <Input
                label='Room Number'
                placeholder='e.g., 101, A-204'
                value={form.roomNo}
                onChange={e => setForm({ ...form, roomNo: e.target.value })}
                error={errors.roomNo}
              />
            </div>

            {/* Anonymous Checkbox */}
            <div className='bg-gray-50 p-4 rounded-lg border-2 border-gray-200'>
              <label className='flex items-start cursor-pointer'>
                <input
                  type='checkbox'
                  checked={form.isAnonymous}
                  onChange={e => setForm({ ...form, isAnonymous: e.target.checked })}
                  className='mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer'
                />
                <div className='ml-3'>
                  <span className='font-semibold text-gray-900'>Raise Anonymously</span>
                  <p className='text-sm text-gray-600 mt-1'>
                    Your identity will be kept confidential. Staff will see this complaint as anonymous.
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className='flex gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => nav('/student/dashboard')}
                className='flex-1'
              >
                Cancel
              </Button>
              <Button variant='success' loading={busy} className='flex-1'>
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                Submit Complaint
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
          <Card className='text-center bg-blue-50 border-blue-200'>
            <div className='text-2xl mb-2'>⚡</div>
            <div className='text-sm font-semibold text-gray-900'>Fast Response</div>
            <div className='text-xs text-gray-600 mt-1'>Staff assigned within 24hrs</div>
          </Card>
          <Card className='text-center bg-green-50 border-green-200'>
            <div className='text-2xl mb-2'>🔔</div>
            <div className='text-sm font-semibold text-gray-900'>Stay Updated</div>
            <div className='text-xs text-gray-600 mt-1'>Track progress in real-time</div>
          </Card>
          <Card className='text-center bg-purple-50 border-purple-200'>
            <div className='text-2xl mb-2'>✅</div>
            <div className='text-sm font-semibold text-gray-900'>Quality Work</div>
            <div className='text-xs text-gray-600 mt-1'>Rate and provide feedback</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
