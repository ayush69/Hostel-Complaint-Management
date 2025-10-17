import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';
import Button from '../components/Button';

export default function AdminStudentEdit(){
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(()=>{ (async()=>{ const r = await api.get(`/admin/students/${id}`); setForm(r.data.student); })(); },[id]);
  if (!form) return <div className='p-4'>Loading...</div>;
  const submit = async (e)=>{ e.preventDefault(); if (busy) return; setBusy(true); try{ await api.put(`/admin/students/${id}`, form); toast.success('Saved'); } catch(err){ toast.error(err?.response?.data?.message || 'Error'); } finally{ setBusy(false); } };
  return (
    <AdminLayout title='Edit Student' breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Students',to:'/admin/students'},{label:'Edit'}]} actions={<button className='underline' onClick={()=>nav(-1)}>Back</button>}>
        <form onSubmit={submit} className='max-w-md space-y-2'>
          <input className='border p-2 w-full' placeholder='Name' value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} />
          <input className='border p-2 w-full' placeholder='Email' value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} />
          <input className='border p-2 w-full' placeholder='Roll No' value={form.rollNo||''} onChange={e=>setForm({...form,rollNo:e.target.value})} />
          <input className='border p-2 w-full' placeholder='Branch' value={form.branch||''} onChange={e=>setForm({...form,branch:e.target.value})} />
          <input className='border p-2 w-full' placeholder='Phone' value={form.phoneNumber||''} onChange={e=>setForm({...form,phoneNumber:e.target.value})} />
          <input className='border p-2 w-full' placeholder='Room No' value={form.roomNo||''} onChange={e=>setForm({...form,roomNo:e.target.value})} />
          <input className='border p-2 w-full' placeholder='Year' value={form.year||''} onChange={e=>setForm({...form,year:e.target.value})} />
          <Button loading={busy}>Save</Button>
        </form>
    </AdminLayout>
  );
}
