import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/pending', label: 'Pending Complaints', icon: '⏳' },
    { to: '/admin/complaints', label: 'All Complaints', icon: '📋' },
    { to: '/admin/students', label: 'Students', icon: '👥' },
    { to: '/admin/staff', label: 'Staff', icon: '👷' },
    { to: '/admin/staff/create', label: 'Create Staff', icon: '➕' }
  ];
  
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 h-screen sticky top-0 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
          <div className="bg-blue-600 rounded-lg p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Admin Panel</h3>
            <p className="text-xs text-gray-500">Management Console</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
