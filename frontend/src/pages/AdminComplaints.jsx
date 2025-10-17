import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

export default function AdminComplaints(){
  const [list,setList]=useState([]);
  const [q,setQ]=useState('');
  const [status,setStatus]=useState('');
  const load=async()=>{ const r=await api.get(`/admin/complaints?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`); setList(r.data.list||[]); };
  useEffect(()=>{ load(); /* eslint-disable-next-line */ },[]);
  return (
    <AdminLayout title='Complaints' breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Complaints'}]} actions={<button className='px-3 py-2 bg-gray-200 rounded' onClick={load}>Refresh</button>}>
      <div className='flex gap-2 mb-3'>
        <input className='border p-2' placeholder='Search title or student' value={q} onChange={e=>setQ(e.target.value)} />
        <select className='border p-2' value={status} onChange={e=>setStatus(e.target.value)}>
          <option value=''>All</option>
          <option>Pending</option>
          <option>Assigned</option>
          <option>InProgress</option>
          <option>Completed</option>
        </select>
        <button className='px-3 py-2 bg-blue-600 text-white rounded' onClick={load}>Search</button>
      </div>
      {list.map(c=>(
        <div key={c._id} className='card p-3 mb-2'>
          <div className='flex justify-between'>
            <div>
              <div className='font-semibold'>{c.title}</div>
              <div className='text-sm text-gray-600'>{c.category} · {c.status}</div>
              <div className='text-sm'>Student: {c.studentId?`${c.studentId.name} (${c.studentId.rollNo})`:(c.studentName||'Anonymous')}</div>
              {c.assignedStaffId && <div className='text-sm'>Assigned: {c.assignedStaffId.name} ({c.assignedStaffId.category})</div>}
            </div>
            {c.rating && (
              <div className='text-right'>
                <div className='font-semibold'>{c.rating}/5</div>
                {c.feedback && <div className='text-xs text-gray-600 max-w-xs'>{c.feedback}</div>}
              </div>
            )}
          </div>
        </div>
      ))}
      {list.length===0 && <div className='text-gray-500'>No complaints</div>}
    </AdminLayout>
  );
}
