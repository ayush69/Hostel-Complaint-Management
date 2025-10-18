import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import StudentRegister from './pages/StudentRegister';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentRaise from './pages/StudentRaise';
import StudentHistory from './pages/StudentHistory';
import StudentFines from './pages/StudentFines';
import ComplaintDetails from './pages/ComplaintDetails';
import StaffLogin from './pages/StaffLogin';
import StaffDashboard from './pages/StaffDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminPending from './pages/AdminPending';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminStaffCreate from './pages/AdminStaffCreate';
import AdminStaff from './pages/AdminStaff';
import AdminStaffEdit from './pages/AdminStaffEdit';
import AdminStudentEdit from './pages/AdminStudentEdit';
import AdminAssign from './pages/AdminAssign';
import AdminComplaints from './pages/AdminComplaints';
import AdminFines from './pages/AdminFines';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
export default function App(){ return (<div><Navbar /><div className='p-4'><Routes>
	<Route path='/' element={<Landing/>} />

	{/* public-only auth pages */}
	<Route element={<PublicOnlyRoute/>}>
		<Route path='/student/register' element={<StudentRegister/>} />
		<Route path='/student/login' element={<StudentLogin/>} />
		<Route path='/staff/login' element={<StaffLogin/>} />
		<Route path='/admin/login' element={<AdminLogin/>} />
	</Route>

	{/* student protected */}
	<Route element={<ProtectedRoute role='student'/>}>
		<Route path='/student/dashboard' element={<StudentDashboard/>} />
		<Route path='/student/raise' element={<StudentRaise/>} />
		<Route path='/student/history' element={<StudentHistory/>} />
			<Route path='/complaints/:id' element={<ComplaintDetails/>} />
		<Route path='/student/fines' element={<StudentFines/>} />
	</Route>

	{/* staff protected */}
	<Route element={<ProtectedRoute role='staff'/>}>
		<Route path='/staff/dashboard' element={<StaffDashboard/>} />
	</Route>

	{/* admin protected */}
	<Route element={<ProtectedRoute role='admin'/>}>
		<Route path='/admin/pending' element={<AdminPending/>} />
			<Route path='/admin/complaints' element={<AdminComplaints/>} />
		<Route path='/admin/complaints/:id/assign' element={<AdminAssign/>} />
		<Route path='/admin/dashboard' element={<AdminDashboard/>} />
		<Route path='/admin/students' element={<AdminStudents/>} />
		<Route path='/admin/students/:id/edit' element={<AdminStudentEdit/>} />
		<Route path='/admin/fines' element={<AdminFines/>} />
		<Route path='/admin/staff' element={<AdminStaff/>} />
		<Route path='/admin/staff/create' element={<AdminStaffCreate/>} />
		<Route path='/admin/staff/:id/edit' element={<AdminStaffEdit/>} />
	</Route>

</Routes></div></div>); }

