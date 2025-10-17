import React from 'react'; import api from '../services/api'; import { setToken } from '../utils/auth'; import toast from 'react-hot-toast'; import Button from '../components/Button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ email: z.string().email('Invalid email'), password: z.string().min(6, 'Min 6 characters') });

export default function StaffLogin(){
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const submit = async (data) => { try{ const res = await api.post('/auth/staff/login', data); setToken(res.data.token); window.location.href='/staff/dashboard'; } catch(err){ toast.error(err?.response?.data?.message || 'Login failed'); } };
  return (
    <div className='max-w-md mx-auto'>
      <h2 className='text-xl mb-2'>Staff Login</h2>
      <form onSubmit={handleSubmit(submit)} className='space-y-2'>
        <div>
          <input className='border p-2 w-full' placeholder='Email' {...register('email')} />
          {errors.email && <div className='text-sm text-red-600'>{errors.email.message}</div>}
        </div>
        <div>
          <input className='border p-2 w-full' type='password' placeholder='Password' {...register('password')} />
          {errors.password && <div className='text-sm text-red-600'>{errors.password.message}</div>}
        </div>
        <Button loading={isSubmitting}>Login</Button>
      </form>
    </div>
  );
}
