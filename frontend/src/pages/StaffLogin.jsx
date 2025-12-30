import React from 'react';
import api from '../services/api';
import { setToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters')
});

export default function StaffLogin() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const submit = async (data) => {
    try {
      const res = await api.post('/auth/staff/login', data);
      setToken(res.data.token);
      toast.success('Welcome back!');
      nav('/staff/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4'>
            <svg className='w-8 h-8 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Staff Login</h1>
          <p className='text-gray-600'>Access your assigned complaints and tasks</p>
        </div>

        {/* Login Card */}
        <Card className='shadow-xl'>
          <form onSubmit={handleSubmit(submit)} className='space-y-6'>
            <Input
              label='Email Address'
              type='email'
              placeholder='staff@example.com'
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label='Password'
              type='password'
              placeholder='Enter your password'
              error={errors.password?.message}
              {...register('password')}
            />

            <Button className='w-full' loading={isSubmitting}>
              <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
              </svg>
              Sign In
            </Button>
          </form>
        </Card>

        {/* Info */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            For login credentials, please contact the administrator
          </p>
        </div>
      </div>
    </div>
  );
}
