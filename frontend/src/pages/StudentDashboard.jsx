import React, {useEffect, useState} from 'react'; import api from '../services/api'; import { Link } from 'react-router-dom';
export default function StudentDashboard(){ const [s,setS]=useState(null); useEffect(()=>{ api.get('/student/dashboard').then(r=>setS(r.data)).catch(()=>{}); },[]); if(!s) return <div>Loading...</div>; return (
	<div>
		<div className='flex items-center justify-between mb-4'>
			<h2 className='text-xl'>Student Dashboard</h2>
			<div className='flex gap-2'>
				<Link to='/student/raise' className='px-3 py-2 bg-green-600 text-white rounded'>Raise Complaint</Link>
				<Link to='/student/history' className='px-3 py-2 bg-gray-200 rounded'>History</Link>
				<Link to='/student/fines' className='px-3 py-2 bg-gray-200 rounded'>Fines</Link>
			</div>
		</div>
		<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
			<div className='card'>Total complaints: {s.total}</div>
			<div className='card'>Pending: {s.pending}</div>
			<div className='card'>Completed: {s.completed}</div>
			<div className='card'>Unpaid fines: {s.unpaid}</div>
		</div>
	</div>
); }
