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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to={homeHref} className='flex items-center gap-2'>
              <div className="bg-white rounded-lg p-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className='font-bold text-xl text-white'>Hostel CMS</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {!role && (
                <>
                  <Link to='/student/login' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Student Login</Link>
                  <Link to='/student/register' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Register</Link>
                  <Link to='/staff/login' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Staff</Link>
                  <Link to='/admin/login' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Admin</Link>
                </>
              )}
              {role === 'student' && (
                <>
                  <Link to='/student/dashboard' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Dashboard</Link>
                  <Link to='/student/raise' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Raise Complaint</Link>
                  <Link to='/student/history' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>History</Link>
                  <Link to='/student/fines' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Fines</Link>
                </>
              )}
              {role === 'staff' && (
                <>
                  <Link to='/staff/dashboard' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Dashboard</Link>
                </>
              )}
              {role === 'admin' && (
                <>
                  <Link to='/admin/dashboard' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Dashboard</Link>
                  <Link to='/admin/complaints' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Complaints</Link>
                  <Link to='/admin/students' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Students</Link>
                  <Link to='/admin/fines' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Manage Fines</Link>
                  <Link to='/admin/staff' className='px-4 py-2 text-sm text-white hover:bg-blue-500 rounded-lg transition-colors'>Staff</Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {token && (
              <>
                {(loc.pathname.includes('/login')) && (
                  <button onClick={switchAccount} className='px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors shadow-sm'>Switch Account</button>
                )}
                <button onClick={logout} className='px-4 py-2 text-sm bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-medium transition-colors shadow-sm'>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
