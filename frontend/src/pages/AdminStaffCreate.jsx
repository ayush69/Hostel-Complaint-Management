import React, { useState } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function AdminStaffCreate(){
  const [form, setForm] = useState({ name:'', email:'', password:'password123', category:'Electrician', phoneNumber:'', address:'', offDay:'' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await api.post('/auth/admin/create-staff', form);
      toast.success('Staff created');
      setForm({ name:'', email:'', password:'password123', category:'Electrician', phoneNumber:'', address:'', offDay:'' });
    } catch(err) {
      toast.error(err?.response?.data?.message || 'Error creating staff');
    } finally { setBusy(false); }
  };

  return (
    <AdminLayout title="Create Staff" breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Staff',to:'/admin/staff'},{label:'Create'}]}>
        <form onSubmit={submit} className="max-w-md space-y-2">
          <input className="border p-2 w-full" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input className="border p-2 w-full" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input className="border p-2 w-full" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          <select className="border p-2 w-full" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            <option>Electrician</option>
            <option>Plumber</option>
            <option>Carpenter</option>
            <option>Cleaner</option>
            <option>Maintenance</option>
            <option>Other</option>
          </select>
          <input className="border p-2 w-full" placeholder="Phone" value={form.phoneNumber} onChange={e=>setForm({...form,phoneNumber:e.target.value})} />
          <input className="border p-2 w-full" placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
          <input className="border p-2 w-full" placeholder="Off day (e.g. Sunday)" value={form.offDay} onChange={e=>setForm({...form,offDay:e.target.value})} />
          <Button variant='success' loading={busy}>Create</Button>
        </form>
    </AdminLayout>
  );
}
