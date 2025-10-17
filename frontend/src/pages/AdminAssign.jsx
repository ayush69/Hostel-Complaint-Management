import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function AdminAssign(){
  const { id } = useParams();
  const nav = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [staff, setStaff] = useState([]);
  const [staffId, setStaffId] = useState('');
  const [busy, setBusy] = useState(false);

  const loadComplaint = async () => {
    const r = await api.get(`/complaints/${id}/details`);
    setComplaint(r.data.complaint);
  };
  const loadStaff = async (category) => {
    const r = await api.get(`/admin/staff?category=${encodeURIComponent(category||'')}`);
    setStaff(r.data.list || []);
  };
  useEffect(()=>{ (async()=>{ await loadComplaint(); })(); },[id]);
  useEffect(()=>{ if (complaint?.category) loadStaff(complaint.category); },[complaint?.category]);

  const assign = async () => {
    if (!staffId) return toast.error('Select a staff');
    setBusy(true);
    try {
      await api.put(`/admin/complaints/${id}/assign`, { staffId });
      toast.success('Assigned');
      nav('/admin/pending');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error assigning');
    } finally { setBusy(false); }
  };

  if (!complaint) return <div className='p-4'>Loading...</div>;
  return (
    <AdminLayout title='Assign Complaint' breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Pending',to:'/admin/pending'},{label:'Assign'}]} actions={<Button variant='secondary' onClick={()=>nav(-1)}>Back</Button>}>
      <div className='card p-4 mb-4'>
        <div className='font-semibold'>{complaint.title}</div>
        <div className='text-sm text-gray-600'>{complaint.category}</div>
        <div className='text-sm'>Room: {complaint.roomNo || '-'}</div>
      </div>
      <div className='card p-4'>
        <div className='mb-2'>Select staff (category: {complaint.category})</div>
        <select className='border p-2 w-full' value={staffId} onChange={e=>setStaffId(e.target.value)}>
          <option value=''>Choose staff</option>
          {staff.map(s => <option key={s._id} value={s._id}>{s.name} · {s.category} {s.offDay ? `(Off: ${s.offDay})` : ''}</option>)}
        </select>
        <div className='mt-3'>
          <Button onClick={assign} loading={busy}>Assign</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
