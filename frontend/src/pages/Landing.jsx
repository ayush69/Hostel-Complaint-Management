import React from 'react'; import { Link } from 'react-router-dom';
export default function Landing(){ return (
	<div className='p-6 max-w-3xl mx-auto'>
		<h1 className='text-3xl font-bold'>Hostel Complaint Management</h1>
		<p className='text-gray-600 mt-2'>Report issues quickly, track progress, and stay informed.</p>
		<div className='mt-6 flex gap-3 flex-wrap'>
			<Link to='/student/login' className='px-4 py-2 bg-blue-600 text-white rounded'>Student Login</Link>
			<Link to='/student/register' className='px-4 py-2 bg-green-600 text-white rounded'>Student Register</Link>
			<Link to='/staff/login' className='px-4 py-2 bg-gray-800 text-white rounded'>Staff Login</Link>
			<Link to='/admin/login' className='px-4 py-2 bg-gray-200 rounded'>Admin Login</Link>
		</div>
	</div>
); }
