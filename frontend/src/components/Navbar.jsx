import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearToken, getToken, getRole } from '../utils/auth';

export default function Navbar(){
  const nav = useNavigate();
  const loc = useLocation();
  const token = getToken();
  const role = getRole();

  const logout = () => { clearToken(); nav('/'); };
  const switchAccount = () => { clearToken(); /* stay on the same page to login again */ };

  // role-based home link
  const homeHref = role === 'admin' ? '/admin/dashboard' : role === 'staff' ? '/staff/dashboard' : role === 'student' ? '/student/dashboard' : '/';

  return (
    <nav className="p-4 bg-white shadow sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={homeHref} className='font-semibold'>HCM</Link>
          {!role && (
            <>
              <Link to='/student/login' className='text-sm underline'>Student Login</Link>
              <Link to='/student/register' className='text-sm underline'>Register</Link>
              <Link to='/staff/login' className='text-sm underline'>Staff</Link>
              <Link to='/admin/login' className='text-sm underline'>Admin</Link>
            </>
          )}
          {role === 'student' && (
            <>
              <Link to='/student/dashboard' className='text-sm underline'>Dashboard</Link>
              <Link to='/student/raise' className='text-sm underline'>Raise</Link>
              <Link to='/student/history' className='text-sm underline'>History</Link>
              <Link to='/student/fines' className='text-sm underline'>Fines</Link>
            </>
          )}
          {role === 'staff' && (
            <>
              <Link to='/staff/dashboard' className='text-sm underline'>Dashboard</Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link to='/admin/dashboard' className='text-sm underline'>Dashboard</Link>
              <Link to='/admin/pending' className='text-sm underline'>Pending</Link>
              <Link to='/admin/students' className='text-sm underline'>Students</Link>
              <Link to='/admin/staff' className='text-sm underline'>Staff</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {token && (
            <>
              {(loc.pathname.includes('/login')) && (
                <button onClick={switchAccount} className='px-3 py-1 text-sm bg-yellow-500 text-white rounded'>Switch account</button>
              )}
              <button onClick={logout} className='px-3 py-1 text-sm bg-gray-800 text-white rounded'>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
