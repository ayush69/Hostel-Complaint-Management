import React from 'react';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

export default function AdminLayout({ title, breadcrumb = [], actions, children }){
  return (
    <div className='flex'>
      <Sidebar />
      <main className='p-4 flex-1'>
        <div className='mb-3 text-sm text-gray-600'>
          {breadcrumb.map((b, i) => (
            <span key={i}>
              {b.to ? <Link className='underline' to={b.to}>{b.label}</Link> : b.label}
              {i < breadcrumb.length - 1 && ' / '}
            </span>
          ))}
        </div>
        <div className='flex items-center justify-between mb-4'>
          {title && <h2 className='text-xl'>{title}</h2>}
          <div className='flex gap-2'>{actions}</div>
        </div>
        {children}
      </main>
    </div>
  );
}
