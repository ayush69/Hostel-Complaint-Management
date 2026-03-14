import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/admin/vendors');
      setVendors(res.data);
    } catch (err) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, isActive) => {
    try {
      await api.put(`/admin/vendors/${id}`, { isActive: !isActive });
      toast.success('Vendor status updated');
      fetchVendors();
    } catch (err) {
      toast.error('Failed to update vendor');
    }
  };

  const deleteVendor = async (id) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    
    try {
      await api.delete(`/admin/vendors/${id}`);
      toast.success('Vendor deleted');
      fetchVendors();
    } catch (err) {
      toast.error('Failed to delete vendor');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Tiffin Vendors</h1>
          <p className='text-gray-600 mt-1'>Manage tiffin service vendors</p>
        </div>
        <Link to='/admin/vendors/create'>
          <Button>
            + Create Vendor
          </Button>
        </Link>
      </div>

      <Card>
        {vendors.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 mb-4'>No vendors found</p>
            <Link to='/admin/vendors/create'>
              <Button>Create First Vendor</Button>
            </Link>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left p-3'>Shop Name</th>
                  <th className='text-left p-3'>Owner</th>
                  <th className='text-left p-3'>Contact</th>
                  <th className='text-left p-3'>Rating</th>
                  <th className='text-left p-3'>Status</th>
                  <th className='text-left p-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(vendor => (
                  <tr key={vendor._id} className='border-b hover:bg-gray-50'>
                    <td className='p-3'>
                      <div>
                        <p className='font-bold'>{vendor.shopName}</p>
                        <p className='text-sm text-gray-600'>{vendor.description}</p>
                      </div>
                    </td>
                    <td className='p-3'>{vendor.name}</td>
                    <td className='p-3'>
                      <div className='text-sm'>
                        <p>{vendor.email}</p>
                        <p className='text-gray-600'>{vendor.phone}</p>
                      </div>
                    </td>
                    <td className='p-3'>
                      <div className='flex items-center gap-1'>
                        <span className='text-yellow-500'>★</span>
                        <span className='font-medium'>{vendor.rating.toFixed(1)}</span>
                        <span className='text-sm text-gray-500'>({vendor.totalRatings})</span>
                      </div>
                    </td>
                    <td className='p-3'>
                      <Badge variant={vendor.isActive ? 'success' : 'danger'}>
                        {vendor.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className='p-3'>
                      <div className='flex gap-2'>
                        <Link to={`/admin/vendors/edit/${vendor._id}`}>
                          <Button size='sm' variant='secondary'>
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size='sm'
                          variant={vendor.isActive ? 'warning' : 'success'}
                          onClick={() => toggleStatus(vendor._id, vendor.isActive)}
                        >
                          {vendor.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size='sm'
                          variant='danger'
                          onClick={() => deleteVendor(vendor._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
