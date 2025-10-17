import React,{useState} from 'react'; import api from '../services/api'; import { setToken, getToken, clearToken } from '../utils/auth'; import { useNavigate, Link } from 'react-router-dom'; import toast from 'react-hot-toast';
export default function StudentLogin(){ const [form,setForm]=useState({email:'',password:''}); const nav=useNavigate(); const token = getToken();
  const submit=async(e)=>{ e.preventDefault(); try{ const res = await api.post('/auth/student/login', form); setToken(res.data.token); nav('/student/dashboard'); } catch(err){ toast.error(err?.response?.data?.message || 'Login failed'); } };
  const switchAccount = ()=>{ clearToken(); };
  return (<div className='max-w-md mx-auto'>
    <h2 className='text-xl mb-2'>Student Login</h2>
    {token && <div className='mb-3 text-sm bg-yellow-100 text-yellow-800 p-2 rounded'>You're already logged in. You can continue to your <Link to='/student/dashboard' className='underline'>dashboard</Link> or <button onClick={switchAccount} className='underline'>switch account</button>.</div>}
    <form onSubmit={submit} className='space-y-2'>
      <input className='border p-2 w-full' placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <input className='border p-2 w-full' type='password' placeholder='Password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <button className='px-4 py-2 bg-blue-600 text-white rounded'>Login</button>
    </form>
    <div className='mt-3 text-sm'>Don't have an account? <Link to='/student/register' className='underline'>Register</Link></div>
  </div>); }
