import React from 'react';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

export default function AdminLayout({ title, breadcrumb = [], actions, children }){
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <main className='flex-1 p-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Breadcrumb */}
          <nav className='mb-4'>
            <ol className='flex items-center gap-2 text-sm'>
              {breadcrumb.map((b, i) => (
                <li key={i} className='flex items-center gap-2'>
                  {b.to ? (
                    <Link className='text-blue-600 hover:text-blue-700 font-medium transition-colors' to={b.to}>
                      {b.label}
                    </Link>
                  ) : (
                    <span className='text-gray-600'>{b.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Page header */}
          <div className='flex items-center justify-between mb-8 pb-6 border-b border-gray-200'>
            {title && <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>}
            <div className='flex gap-3'>{actions}</div>
          </div>

          {/* Content */}
          <div className='animate-slide-in'>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
