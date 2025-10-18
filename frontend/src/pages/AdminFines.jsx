import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Input from '../components/Input';
import toast from 'react-hot-toast';

export default function AdminFines() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unpaid, paid
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFine, setEditingFine] = useState(null);
  const [newAmount, setNewAmount] = useState('');

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/students?per=100`);
      setStudents(res.data.list || []);
    } catch (e) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleReduceFine = async (fineId, studentId) => {
    if (!newAmount || parseFloat(newAmount) <= 0) {
      toast.error('Please enter a valid amount greater than zero');
      return;
    }
    try {
      await api.put(`/admin/fines/${fineId}/reduce`, { newAmount: parseFloat(newAmount) });
      toast.success('Fine amount updated successfully');
      setEditingFine(null);
      setNewAmount('');
      await loadStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error updating fine');
    }
  };

  const handleDeleteFine = async (fineId) => {
    if (!window.confirm('Are you sure you want to delete this fine?')) return;
    try {
      await api.delete(`/admin/fines/${fineId}`);
      toast.success('Fine deleted successfully');
      await loadStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error deleting fine');
    }
  };

  // Get all students with fines
  const studentsWithFines = students.filter(s => s.fineStats && s.fineStats.totalFines > 0);
  
  // Filter based on selection
  const filteredStudents = studentsWithFines.filter(s => {
    if (filter === 'unpaid') return s.fineStats.unpaidFines > 0;
    if (filter === 'paid') return s.fineStats.unpaidFines === 0 && s.fineStats.totalFines > 0;
    return true;
  });

  // Search filter
  const searchedStudents = filteredStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalUnpaid = studentsWithFines.reduce((sum, s) => sum + (s.fineStats?.totalUnpaid || 0), 0);
  const totalPaid = studentsWithFines.reduce((sum, s) => sum + (s.fineStats?.totalPaid || 0), 0);
  const totalStudentsWithFines = studentsWithFines.length;
  const totalStudentsWithUnpaid = studentsWithFines.filter(s => s.fineStats?.unpaidFines > 0).length;

  return (
    <AdminLayout
      title='Manage Fines'
      breadcrumb={[
        { label: 'Admin', to: '/admin/dashboard' },
        { label: 'Manage Fines' }
      ]}
    >
      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <Card className='bg-red-50 border-red-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-red-600 font-semibold mb-1'>Total Unpaid</p>
              <p className='text-3xl font-bold text-red-700'>₹{totalUnpaid}</p>
              <p className='text-xs text-red-500 mt-1'>{totalStudentsWithUnpaid} students</p>
            </div>
            <div className='bg-red-100 p-3 rounded-full'>
              <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
        </Card>

        <Card className='bg-green-50 border-green-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-green-600 font-semibold mb-1'>Total Paid</p>
              <p className='text-3xl font-bold text-green-700'>₹{totalPaid}</p>
            </div>
            <div className='bg-green-100 p-3 rounded-full'>
              <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
        </Card>

        <Card className='bg-blue-50 border-blue-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-blue-600 font-semibold mb-1'>Total Amount</p>
              <p className='text-3xl font-bold text-blue-700'>₹{totalUnpaid + totalPaid}</p>
            </div>
            <div className='bg-blue-100 p-3 rounded-full'>
              <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
            </div>
          </div>
        </Card>

        <Card className='bg-purple-50 border-purple-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-purple-600 font-semibold mb-1'>Students</p>
              <p className='text-3xl font-bold text-purple-700'>{totalStudentsWithFines}</p>
              <p className='text-xs text-purple-500 mt-1'>with fines</p>
            </div>
            <div className='bg-purple-100 p-3 rounded-full'>
              <svg className='w-8 h-8 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className='mb-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <Input
              placeholder='Search by student name or roll number...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-2'>
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All ({studentsWithFines.length})
            </Button>
            <Button
              variant={filter === 'unpaid' ? 'primary' : 'outline'}
              onClick={() => setFilter('unpaid')}
            >
              Unpaid ({studentsWithFines.filter(s => s.fineStats?.unpaidFines > 0).length})
            </Button>
            <Button
              variant={filter === 'paid' ? 'primary' : 'outline'}
              onClick={() => setFilter('paid')}
            >
              Paid ({studentsWithFines.filter(s => s.fineStats?.unpaidFines === 0 && s.fineStats?.totalFines > 0).length})
            </Button>
          </div>
        </div>
      </Card>

      {/* Students with Fines List */}
      {loading ? (
        <div className='space-y-4'>
          {[1, 2, 3].map(i => (
            <Card key={i} className='animate-pulse'>
              <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            </Card>
          ))}
        </div>
      ) : searchedStudents.length === 0 ? (
        <Card className='text-center py-12'>
          <svg className='w-16 h-16 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <p className='text-gray-500 text-lg'>No students found with fines</p>
        </Card>
      ) : (
        <div className='space-y-4'>
          {searchedStudents.map(student => (
            <Card key={student._id} className='hover:border-blue-300'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div className='bg-blue-100 p-3 rounded-full'>
                    <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900'>{student.name}</h3>
                    <p className='text-sm text-gray-600'>Roll No: {student.rollNo} • Room: {student.roomNo || 'N/A'}</p>
                  </div>
                </div>
                <div className='text-right'>
                  {student.fineStats.unpaidFines > 0 ? (
                    <>
                      <p className='text-2xl font-bold text-red-600'>₹{student.fineStats.totalUnpaid}</p>
                      <Badge variant='red'>{student.fineStats.unpaidFines} Unpaid</Badge>
                    </>
                  ) : (
                    <>
                      <p className='text-2xl font-bold text-green-600'>₹{student.fineStats.totalPaid}</p>
                      <Badge variant='green'>All Paid</Badge>
                    </>
                  )}
                </div>
              </div>

              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-semibold text-gray-900'>Fine Details</h4>
                  <Link to={`/admin/students/${student._id}/edit`}>
                    <Button size='sm' variant='outline'>
                      <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      </svg>
                      View All Fines
                    </Button>
                  </Link>
                </div>
                <div className='grid grid-cols-3 gap-4 text-sm'>
                  <div>
                    <p className='text-gray-600'>Total Fines</p>
                    <p className='font-bold text-gray-900'>{student.fineStats.totalFines}</p>
                  </div>
                  <div>
                    <p className='text-gray-600'>Unpaid Amount</p>
                    <p className='font-bold text-red-600'>₹{student.fineStats.totalUnpaid}</p>
                  </div>
                  <div>
                    <p className='text-gray-600'>Paid Amount</p>
                    <p className='font-bold text-green-600'>₹{student.fineStats.totalPaid}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
