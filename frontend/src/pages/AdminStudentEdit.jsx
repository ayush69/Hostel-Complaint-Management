import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Badge from '../components/Badge';

export default function AdminStudentEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [fines, setFines] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingFine, setEditingFine] = useState(null);
  const [newAmount, setNewAmount] = useState('');

  const loadFines = async () => {
    try {
      const r = await api.get(`/admin/students/${id}/fines`);
      setFines(r.data.fines || []);
    } catch (e) {
      console.error('Failed to load fines');
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const r = await api.get(`/admin/students/${id}`);
        setForm(r.data.student);
        await loadFines();
      } catch (e) {
        toast.error('Failed to load student details');
        nav('/admin/students');
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
      await api.put(`/admin/students/${id}`, form);
      toast.success('Student details updated successfully!');
      nav('/admin/students');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving changes');
    } finally {
      setBusy(false);
    }
  };

  const handleReduceFine = async (fineId) => {
    if (!newAmount || parseFloat(newAmount) <= 0) {
      toast.error('Please enter a valid amount greater than zero');
      return;
    }
    try {
      await api.put(`/admin/fines/${fineId}/reduce`, { newAmount: parseFloat(newAmount) });
      toast.success('Fine amount reduced successfully');
      setEditingFine(null);
      setNewAmount('');
      await loadFines();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error reducing fine');
    }
  };

  const handleDeleteFine = async (fineId) => {
    if (!window.confirm('Are you sure you want to delete this fine?')) return;
    try {
      await api.delete(`/admin/fines/${fineId}`);
      toast.success('Fine deleted successfully');
      await loadFines();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error deleting fine');
    }
  };

  if (loading || !form) {
    return (
      <AdminLayout title='Edit Student'>
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

  return (
    <AdminLayout
      title='Edit Student'
      breadcrumb={[
        { label: 'Admin', to: '/admin/dashboard' },
        { label: 'Students', to: '/admin/students' },
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
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900'>Edit Student Information</h2>
              <p className='text-sm text-gray-600'>Update student details</p>
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
                  placeholder='Enter student name'
                  value={form.name || ''}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />

                <Input
                  label='Email Address'
                  type='email'
                  placeholder='student@example.com'
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

            {/* Academic Information */}
            <div>
              <h3 className='text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide'>
                Academic Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                  label='Roll Number'
                  placeholder='e.g., 2021001'
                  value={form.rollNo || ''}
                  onChange={e => setForm({ ...form, rollNo: e.target.value })}
                />

                <Input
                  label='Branch / Department'
                  placeholder='e.g., Computer Science'
                  value={form.branch || ''}
                  onChange={e => setForm({ ...form, branch: e.target.value })}
                />

                <Input
                  label='Year'
                  type='number'
                  placeholder='e.g., 1, 2, 3, 4'
                  value={form.year || ''}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                />

                <Input
                  label='Room Number'
                  placeholder='e.g., 101, A-204'
                  value={form.roomNo || ''}
                  onChange={e => setForm({ ...form, roomNo: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className='flex gap-3 pt-4 border-t border-gray-200'>
              <Button loading={busy} className='flex-1'>
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                Save Changes
              </Button>
              <Button type='button' variant='outline' onClick={() => nav('/admin/students')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Fines Management */}
        <Card className='mt-6'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className='bg-red-100 p-3 rounded-full'>
                <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <div>
                <h2 className='text-xl font-bold text-gray-900'>Manage Fines</h2>
                <p className='text-sm text-gray-600'>View and manage student fines</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-500'>Total Fines</p>
              <p className='text-2xl font-bold text-gray-900'>{fines.length}</p>
            </div>
          </div>

          {fines.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-lg'>
              <svg className='w-16 h-16 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <p className='text-gray-500 text-lg'>No fines imposed on this student</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {fines.map(fine => (
                <div key={fine._id} className={`border-2 rounded-lg p-4 ${fine.status === 'Unpaid' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <Badge variant={fine.status === 'Unpaid' ? 'red' : 'green'}>
                          {fine.status}
                        </Badge>
                        {editingFine === fine._id ? (
                          <div className='flex items-center gap-2'>
                            <Input
                              type='number'
                              placeholder='New amount'
                              value={newAmount}
                              onChange={e => setNewAmount(e.target.value)}
                              className='w-32'
                            />
                            <Button size='sm' onClick={() => handleReduceFine(fine._id)}>
                              Save
                            </Button>
                            <Button size='sm' variant='outline' onClick={() => {
                              setEditingFine(null);
                              setNewAmount('');
                            }}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <span className='text-2xl font-bold text-gray-900'>₹{fine.amount}</span>
                        )}
                      </div>
                      <p className='text-sm text-gray-700 mb-2'><strong>Reason:</strong> {fine.reason || 'No reason provided'}</p>
                      <div className='flex items-center gap-4 text-xs text-gray-600'>
                        <span>Imposed by: {fine.imposedBy?.name || 'Admin'}</span>
                        <span>Date: {new Date(fine.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      {editingFine !== fine._id && (
                        <>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => {
                              setEditingFine(fine._id);
                              setNewAmount(fine.amount);
                            }}
                          >
                            <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                            </svg>
                            Edit Fine
                          </Button>
                          <Button
                            size='sm'
                            variant='danger'
                            onClick={() => handleDeleteFine(fine._id)}
                          >
                            <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
