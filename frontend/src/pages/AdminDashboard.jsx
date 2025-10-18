import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

export default function AdminDashboard(){
  const [counts, setCounts] = useState({ pending: 0, students: 0, staff: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, s, st, all] = await Promise.all([
          api.get('/admin/complaints/pending'),
          api.get('/admin/students?page=1&per=1'),
          api.get('/admin/staff?page=1&per=1'),
          api.get('/admin/complaints?page=1&per=1')
        ]);
        setCounts({
          pending: (p.data.list || []).length,
          students: s.data.total || 0,
          staff: st.data.total || 0,
          total: all.data.total || 0
        });
      } catch (e) {
        // ignore errors for dashboard counts
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = [
    {
      label: 'Pending Complaints',
      value: counts.pending,
      icon: '⏳',
      color: 'yellow',
      link: '/admin/pending',
      linkText: 'View All'
    },
    {
      label: 'Total Complaints',
      value: counts.total,
      icon: '📋',
      color: 'blue',
      link: '/admin/complaints',
      linkText: 'View All'
    },
    {
      label: 'Total Students',
      value: counts.students,
      icon: '👥',
      color: 'green',
      link: '/admin/students',
      linkText: 'Manage'
    },
    {
      label: 'Total Staff',
      value: counts.staff,
      icon: '👷',
      color: 'purple',
      link: '/admin/staff',
      linkText: 'Manage'
    }
  ];

  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <AdminLayout title="Dashboard" breadcrumb={[{label:'Admin',to:'/admin/dashboard'},{label:'Dashboard'}]}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${colorClasses[stat.color]} opacity-10 rounded-full -mr-8 -mt-8`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClasses[stat.color]} border`}>
                  {loading ? '...' : stat.value}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.label}</h3>
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                ) : (
                  stat.value
                )}
              </div>
              <Link
                to={stat.link}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1 group"
              >
                {stat.linkText}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/pending"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Review Pending</div>
                <div className="text-sm text-gray-500">Assign staff to complaints</div>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/staff/create"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-600 transition-colors">
                <svg className="w-6 h-6 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Add Staff</div>
                <div className="text-sm text-gray-500">Create new staff member</div>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/complaints"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-600 transition-colors">
                <svg className="w-6 h-6 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">View Reports</div>
                <div className="text-sm text-gray-500">All complaints history</div>
              </div>
            </div>
          </Link>
        </div>
      </Card>
    </AdminLayout>
  );
}
