import React, { useState } from 'react';
import api from '../services/api';
import { setToken } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function StudentRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '', rollNo: '' });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/student/register', form);
      setToken(res.data.token);
      toast.success('Registration successful!');
      nav('/student/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg'>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h2>
          <p className='text-gray-600'>Join us to start reporting complaints</p>
        </div>

        <Card>
          <form onSubmit={submit} className='space-y-5'>
            <Input
              label="Full Name"
              placeholder='Enter your full name'
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder='Enter your email'
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Roll Number"
              placeholder='Enter your roll number'
              value={form.rollNo}
              onChange={e => setForm({ ...form, rollNo: e.target.value })}
              required
            />
            <Input
              label="Password"
              type='password'
              placeholder='Create a strong password'
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button className='w-full' variant='success' size='lg' loading={loading}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Create my account
            </Button>
          </form>
        </Card>

        <div className='mt-6 text-center'>
          <p className='text-gray-600 text-sm'>
            Already have an account?{' '}
            <Link to='/student/login' className='text-blue-600 hover:text-blue-700 font-medium'>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
