import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

export default function AdminVendorEdit() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
    description: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    try {
      const res = await api.get(`/admin/vendors/${id}`);
      setForm({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        shopName: res.data.shopName,
        description: res.data.description || '',
        isActive: res.data.isActive
      });
    } catch (err) {
      toast.error('Failed to load vendor');
      nav('/admin/vendors');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/admin/vendors/${id}`, form);
      toast.success('Vendor updated successfully');
      nav('/admin/vendors');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update vendor');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-6">Loading...</div>;

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Edit Vendor</h1>
        <p className='text-gray-600 mt-1'>Update vendor information</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='grid md:grid-cols-2 gap-5'>
            <Input
              label='Owner Name'
              placeholder='Enter owner name'
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label='Shop Name'
              placeholder='Enter shop/business name'
              value={form.shopName}
              onChange={e => setForm({ ...form, shopName: e.target.value })}
              required
            />
          </div>

          <div className='grid md:grid-cols-2 gap-5'>
            <Input
              label='Email'
              type='email'
              placeholder='vendor@example.com'
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label='Phone'
              type='tel'
              placeholder='1234567890'
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <textarea
              placeholder='Brief description about the tiffin service'
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              rows={3}
            />
          </div>

          <div>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                className='w-5 h-5'
              />
              <span className='text-sm font-medium text-gray-700'>
                Active (vendor can login and receive orders)
              </span>
            </label>
          </div>

          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => nav('/admin/vendors')}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button type='submit' loading={loading} className='flex-1'>
              Update Vendor
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
