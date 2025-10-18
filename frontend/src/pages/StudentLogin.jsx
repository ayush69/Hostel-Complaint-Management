import React, { useState } from 'react';
import api from '../services/api';
import { setToken, getToken, clearToken } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function StudentLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const token = getToken();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/student/login', form);
      setToken(res.data.token);
      toast.success('Login successful!');
      nav('/student/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const switchAccount = () => { clearToken(); };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg'>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Student Login</h2>
          <p className='text-gray-600'>Welcome back! Please enter your details</p>
        </div>

        {token && (
          <Card className='mb-6 border-yellow-200 bg-yellow-50'>
            <div className='flex items-start gap-3'>
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className='text-sm text-yellow-800'>
                <p className='font-medium mb-1'>Already logged in</p>
                <p>
                  Continue to your{' '}
                  <Link to='/student/dashboard' className='underline font-medium'>
                    dashboard
                  </Link>
                  {' '}or{' '}
                  <button onClick={switchAccount} className='underline font-medium'>
                    switch account
                  </button>
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <form onSubmit={submit} className='space-y-5'>
            <Input
              label="Email Address"
              type="email"
              placeholder='Enter your email'
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type='password'
              placeholder='Enter your password'
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button className='w-full' size='lg' loading={loading}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login to your account
            </Button>
          </form>
        </Card>

        <div className='mt-6 text-center'>
          <p className='text-gray-600 text-sm'>
            Don't have an account?{' '}
            <Link to='/student/register' className='text-blue-600 hover:text-blue-700 font-medium'>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
