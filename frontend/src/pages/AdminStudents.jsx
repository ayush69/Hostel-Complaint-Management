import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function AdminStudents(){
  const [list, setList] = useState([]);
  const [page] = useState(1);
  const [per] = useState(50);
  const [fine, setFine] = useState({ studentId:'', amount:'', reason:'' });
  const [q, setQ] = useState('');

  const load = async () => {
    try {
      const res = await api.get(`/admin/students?page=${page}&per=${per}&q=${encodeURIComponent(q)}`);
      setList(res.data.list || []);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, per]);

  const impose = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/fines/impose', { studentId: fine.studentId, amount: Number(fine.amount), reason: fine.reason });
      toast.success('Fine imposed');
      setFine({ studentId:'', amount:'', reason:'' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error imposing fine');
    }
  };

  return (
    <AdminLayout title='Students' breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Students'}]} actions={<Button variant='secondary' onClick={load}>Search</Button>}>
      <div className="flex items-center gap-2 mb-4">
        <input className="border p-2" placeholder="Search name or roll" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          {list.map(s => (
            <div key={s._id} className="card p-3 mb-2 flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.name} <span className="text-sm text-gray-500">({s.rollNo})</span></div>
                <div className="text-sm">{s.email}</div>
                <div className="text-sm">Room: {s.roomNo || '-'} | Branch: {s.branch || '-'}</div>
              </div>
              <Link className="underline" to={`/admin/students/${s._id}/edit`}>Edit</Link>
            </div>
          ))}
          {list.length === 0 && <div className="text-gray-500">No students found</div>}
        </div>
        <div>
          <h3 className="font-bold mb-2">Impose Fine</h3>
          <form onSubmit={impose} className="space-y-2">
            <select className="border p-2 w-full" value={fine.studentId} onChange={e=>setFine({...fine,studentId:e.target.value})}>
              <option value="">Select student</option>
              {list.map(s=> <option key={s._id} value={s._id}>{s.name} ({s.rollNo})</option>)}
            </select>
            <input className="border p-2 w-full" placeholder="Amount" value={fine.amount} onChange={e=>setFine({...fine,amount:e.target.value})} />
            <input className="border p-2 w-full" placeholder="Reason" value={fine.reason} onChange={e=>setFine({...fine,reason:e.target.value})} />
            <Button variant='danger'>Impose</Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
