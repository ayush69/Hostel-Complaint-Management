import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getRole } from '../utils/auth';

export default function ProtectedRoute({ role }){
  const r = getRole();
  if (!r) {
    // not logged in -> send to relevant login
    const target = role === 'admin' ? '/admin/login' : role === 'staff' ? '/staff/login' : '/student/login';
    return <Navigate to={target} replace />;
  }
  if (role && r !== role) {
    // wrong role -> send to their own dashboard
    const target = r === 'admin' ? '/admin/dashboard' : r === 'staff' ? '/staff/dashboard' : '/student/dashboard';
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
}
