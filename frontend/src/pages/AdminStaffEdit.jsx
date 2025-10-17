import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';
import Button from '../components/Button';

export default function AdminStaffEdit(){
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(()=>{ (async()=>{ const r = await api.get(`/admin/staff/${id}`); setForm(r.data.staff); })(); },[id]);
  if (!form) return <div className='p-4'>Loading...</div>;
  const submit = async (e)=>{
    e.preventDefault(); if (busy) return; setBusy(true);
  try { await api.put(`/admin/staff/${id}`, form); toast.success('Saved'); }
  catch(err){ toast.error(err?.response?.data?.message || 'Error saving'); }
    finally{ setBusy(false); }
  };
  return (
    <AdminLayout title='Edit Staff' breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Staff',to:'/admin/staff'},{label:'Edit'}]} actions={<button className='underline' onClick={()=>nav(-1)}>Back</button>}>
        <form onSubmit={submit} className='max-w-md space-y-2'>
          <input className='border p-2 w-full' placeholder='Name' value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} />
          <input className='border p-2 w-full' placeholder='Email' value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} />
          <select className='border p-2 w-full' value={form.category||'Other'} onChange={e=>setForm({...form,category:e.target.value})}>
            <option>Electrician</option>
            <option>Plumber</option>
            <option>Carpenter</option>
            <option>Cleaner</option>
            <option>Maintenance</option>
            <option>Other</option>
          </select>
          <input className='border p-2 w-full' placeholder='Phone' value={form.phoneNumber||''} onChange={e=>setForm({...form,phoneNumber:e.target.value})} />
          <input className='border p-2 w-full' placeholder='Address' value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})} />
          <input className='border p-2 w-full' placeholder='Off day' value={form.offDay||''} onChange={e=>setForm({...form,offDay:e.target.value})} />
          <label className='flex items-center gap-2'><input type='checkbox' checked={!!form.deleted} onChange={e=>setForm({...form,deleted:e.target.checked})} /> Mark deleted</label>
          <Button loading={busy}>Save</Button>
        </form>
    </AdminLayout>
  );
}
