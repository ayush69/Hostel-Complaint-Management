import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Landing() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50'>
      {/* Hero Section */}
      <div className='max-w-7xl mx-auto px-6 py-20'>
        <div className='text-center max-w-4xl mx-auto'>
          <div className='inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6'>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Fast & Efficient Complaint Resolution
          </div>
          
          <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
            Hostel Complaint<br/>
            <span className='bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
              Management System
            </span>
          </h1>
          
          <p className='text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto'>
            Report issues quickly, track progress in real-time, and stay informed with our comprehensive complaint management platform designed for hostels.
          </p>

          {/* CTA Buttons */}
          <div className='flex gap-4 justify-center flex-wrap mb-16'>
            <Link to='/student/register'>
              <Button size='lg' className='shadow-lg hover:shadow-xl'>
                <span className='flex items-center gap-2'>
                  Get Started
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
            <Link to='/student/login'>
              <Button variant='outline' size='lg' className='shadow-lg hover:shadow-xl'>
                Student Login
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className='grid md:grid-cols-3 gap-8 mb-16'>
            <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
              <div className='bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto'>
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Quick Reporting</h3>
              <p className='text-gray-600'>Submit complaints instantly with detailed descriptions and track them in real-time.</p>
            </div>

            <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
              <div className='bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto'>
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Real-time Tracking</h3>
              <p className='text-gray-600'>Monitor complaint status from submission to resolution with live updates.</p>
            </div>

            <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
              <div className='bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto'>
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Fast Resolution</h3>
              <p className='text-gray-600'>Efficient staff assignment ensures your complaints are resolved quickly.</p>
            </div>
          </div>

          {/* Quick Access Links */}
          <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
            <h3 className='text-lg font-semibold text-gray-900 mb-6'>Access Portal</h3>
            <div className='flex gap-4 justify-center flex-wrap'>
              <Link to='/staff/login'>
                <Button variant='secondary'>Staff Login</Button>
              </Link>
              <Link to='/admin/login'>
                <Button variant='ghost'>Admin Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
