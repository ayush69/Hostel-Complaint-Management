import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

export default function AdminStaff(){
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const load = async () => { const r = await api.get(`/admin/staff?q=${encodeURIComponent(q)}`); setList(r.data.list || []); };
  useEffect(()=>{ load(); },[]);
  return (
    <AdminLayout title='Staff' breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Staff'}]} actions={<Link to='/admin/staff/create' className='px-3 py-2 bg-green-600 text-white rounded'>Create</Link>}>
      <div className='flex items-center gap-2 mb-4'>
        <input className='border p-2' placeholder='Search name/email' value={q} onChange={e=>setQ(e.target.value)} />
        <button className='px-3 py-2 bg-gray-200 rounded' onClick={load}>Search</button>
      </div>
      {list.map(s=> (
        <div key={s._id} className='card p-3 mb-2 flex items-center justify-between'>
          <div>
            <div className='font-semibold'>{s.name}</div>
            <div className='text-sm text-gray-600'>{s.email} · {s.category}</div>
            <div className='text-sm'>Rating: {s.avgRating ? `${s.avgRating}/5` : 'No ratings'} {s.ratingsCount?`(${s.ratingsCount})`:''}</div>
          </div>
          <Link to={`/admin/staff/${s._id}/edit`} className='underline'>Edit</Link>
        </div>
      ))}
      {list.length===0 && <div className='text-gray-500'>No staff found</div>}
    </AdminLayout>
  );
}
