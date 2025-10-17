import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';

export default function AdminDashboard(){
  const [counts, setCounts] = useState({ pending: 0, students: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [p, s] = await Promise.all([
          api.get('/admin/complaints/pending'),
          api.get('/admin/students?page=1&per=1')
        ]);
        setCounts({ pending: (p.data.list || []).length, students: s.data.total || 0 });
      } catch (e) {
        // ignore errors for dashboard counts
      }
    }
    load();
  }, []);

  return (
    <AdminLayout title="Admin Dashboard" breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Dashboard'}]}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div className="card p-4">
          <div className="text-gray-600">Pending complaints</div>
          <div className="text-2xl font-bold">{counts.pending}</div>
          <div className="mt-2"><Link to="/admin/pending" className="underline">View</Link></div>
        </div>
        <div className="card p-4">
          <div className="text-gray-600">Total students</div>
          <div className="text-2xl font-bold">{counts.students}</div>
          <div className="mt-2"><Link to="/admin/students" className="underline">Manage</Link></div>
        </div>
      </div>
    </AdminLayout>
  );
}
