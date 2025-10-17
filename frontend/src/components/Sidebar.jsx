import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-56 p-4 bg-white shadow h-screen sticky top-0">
      <h3 className="font-bold mb-4">Admin</h3>
      <nav className="flex flex-col space-y-2 text-sm">
        <Link to="/admin/dashboard" className="underline">Dashboard</Link>
        <Link to="/admin/pending" className="underline">Pending Complaints</Link>
  <Link to="/admin/complaints" className="underline">All Complaints</Link>
        <Link to="/admin/students" className="underline">Students</Link>
        <Link to="/admin/staff" className="underline">Staff</Link>
        <Link to="/admin/staff/create" className="underline">Create Staff</Link>
      </nav>
    </aside>
  );
}
