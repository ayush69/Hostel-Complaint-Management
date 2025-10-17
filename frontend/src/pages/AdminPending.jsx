import React,{useEffect,useState} from 'react'; import api from '../services/api'; import AdminLayout from '../components/AdminLayout'; import { Link } from 'react-router-dom';
export default function AdminPending(){ const [list,setList]=useState([]); useEffect(()=>{ api.get('/admin/complaints/pending').then(r=>setList(r.data.list)).catch(()=>{}); },[]); return (
	<AdminLayout title='Pending Complaints' breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Pending'}]}>
		{list.map(c=>(
					<div key={c._id} className='card mb-2 p-3 flex items-center justify-between'>
						<div>
							<strong>{c.title}</strong>
							<div className='text-sm text-gray-600'>{c.category}</div>
							<div className='text-sm'>Student: {c.studentId?c.studentId.name:'Anonymous'}</div>
						</div>
						<Link to={`/admin/complaints/${c._id}/assign`} className='underline'>Assign</Link>
			</div>
		))}
		{list.length === 0 && <div className='text-gray-500'>No pending complaints</div>}
	</AdminLayout>
); }
