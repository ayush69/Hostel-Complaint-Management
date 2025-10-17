import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getRole } from '../utils/auth';

export default function PublicOnlyRoute(){
  const r = getRole();
  if (r) {
    const target = r === 'admin' ? '/admin/dashboard' : r === 'staff' ? '/staff/dashboard' : '/student/dashboard';
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
}
