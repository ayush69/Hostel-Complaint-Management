import React,{useEffect,useState} from 'react'; import api from '../services/api'; import Button from '../components/Button'; import toast from 'react-hot-toast';
export default function StaffDashboard(){
  const [tasks,setTasks]=useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [changeId, setChangeId] = useState(null);
  const [newStatus, setNewStatus] = useState('InProgress');
  const load = async () => { const r = await api.get(`/staff/assigned-complaints${statusFilter?`?status=${statusFilter}`:''}`); setTasks(r.data.list||[]); };
  useEffect(()=>{ load(); // eslint-disable-next-line
  },[statusFilter]);
  const update=async(id,status)=>{ try{ await api.put(`/staff/complaints/${id}/update-status`, { status }); toast.success('Updated'); load(); } catch(e){ toast.error(e?.response?.data?.message || 'Error'); } };
  return (
    <div>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl'>Staff Dashboard</h2>
        <select className='border p-2' value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value=''>All</option>
          <option value='Pending'>Pending</option>
          <option value='Assigned'>Assigned</option>
          <option value='InProgress'>InProgress</option>
          <option value='Completed'>Completed</option>
        </select>
      </div>
      {tasks.map(t=>(
        <div key={t._id} className='card mb-2'>
          <div className='font-semibold'>{t.title}</div>
          <div className='text-sm text-gray-600'>{t.status} · Room: {t.roomNo||'-'}</div>
          <div className='mt-2'>
            {t.status === 'Assigned' && (
              <Button variant='secondary' onClick={()=>update(t._id,'InProgress')}>Start (InProgress)</Button>
            )}
            {t.status === 'InProgress' && (
              <Button variant='success' onClick={()=>update(t._id,'Completed')}>Mark Completed</Button>
            )}
            {t.status === 'Completed' && (
              <div className='flex items-center gap-2'>
                {changeId !== t._id ? (
                  <Button variant='secondary' onClick={()=>{ setChangeId(t._id); setNewStatus('InProgress'); }}>Change Status</Button>
                ) : (
                  <>
                    <select className='border p-2' value={newStatus} onChange={e=>setNewStatus(e.target.value)}>
                      <option value='InProgress'>InProgress</option>
                      <option value='Assigned'>Assigned</option>
                    </select>
                    <Button variant='primary' onClick={async()=>{ await update(t._id,newStatus); setChangeId(null); }}>Change</Button>
                    <Button variant='secondary' onClick={()=>setChangeId(null)}>Cancel</Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      {tasks.length===0 && <div className='text-gray-500'>No tasks</div>}
    </div>
  );
}
