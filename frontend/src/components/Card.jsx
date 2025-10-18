import React from 'react';

export default function Card({ children, className = '', hover = true }) {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-100 p-6 ${hover ? 'hover:shadow-lg' : ''} transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
}