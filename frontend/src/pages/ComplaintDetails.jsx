import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function ComplaintDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const r = await api.get(`/complaints/${id}/details`);
      setC(r.data.complaint);
      setRating(r.data.complaint.rating || 0);
      setFeedback(r.data.complaint.feedback || '');
    } catch {
      toast.error('Complaint not found');
      nav(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  const canRate = c?.status === 'Completed';

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/complaints/${id}/rate`, { rating, feedback });
      toast.success('Feedback saved successfully!');
      setEditing(false);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error saving feedback');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse'></div>
          <Card className='animate-pulse mb-6'>
            <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2 mb-6'></div>
            <div className='h-20 bg-gray-200 rounded'></div>
          </Card>
        </div>
      </div>
    );
  }

  if (!c) return null;

  const statusColors = {
    Pending: 'yellow',
    Assigned: 'blue',
    'In Progress': 'purple',
    Completed: 'green',
    Rejected: 'red'
  };

  const categoryIcons = {
    Electrician: '⚡',
    Plumber: '🔧',
    Carpenter: '🪛',
    Cleaner: '🧹',
    Maintenance: '🔨',
    Other: '📋'
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Back Button */}
        <button
          onClick={() => nav(-1)}
          className='flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Back
        </button>

        {/* Complaint Details Card */}
        <Card className='mb-6'>
          <div className='flex items-start gap-4 mb-6'>
            <div className='bg-blue-100 p-4 rounded-full'>
              <span className='text-3xl'>{categoryIcons[c.category] || '📋'}</span>
            </div>
            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>{c.title}</h1>
              <div className='flex flex-wrap gap-2 items-center'>
                <Badge variant={statusColors[c.status] || 'default'}>{c.status}</Badge>
                <span className='text-sm text-gray-500'>•</span>
                <span className='text-sm text-gray-600'>{c.category}</span>
                {c.isAnonymous && (
                  <>
                    <span className='text-sm text-gray-500'>•</span>
                    <span className='text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full'>
                      🔒 Anonymous
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='mb-6'>
            <h3 className='text-sm font-bold text-gray-700 mb-2'>Description</h3>
            <p className='text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200'>
              {c.description}
            </p>
          </div>

          {/* Info Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200'>
              <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
              </svg>
              <div>
                <div className='text-xs text-gray-500 font-medium'>Room Number</div>
                <div className='text-sm font-semibold text-gray-900'>{c.roomNo || 'Not specified'}</div>
              </div>
            </div>

            <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200'>
              <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <div>
                <div className='text-xs text-gray-500 font-medium'>Created On</div>
                <div className='text-sm font-semibold text-gray-900'>
                  {new Date(c.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Staff */}
          {c.assignedStaffId && (
            <div className='mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <h3 className='text-sm font-bold text-blue-900 mb-2'>Assigned Staff</h3>
              <div className='flex items-center gap-3'>
                <div className='bg-blue-100 p-2 rounded-full'>
                  <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
                <div>
                  <div className='font-semibold text-blue-900'>{c.assignedStaffId.name}</div>
                  <div className='text-sm text-blue-700'>{c.assignedStaffId.category}</div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Feedback Card */}
        <Card>
          <div className='flex items-center gap-2 mb-4'>
            <svg className='w-6 h-6 text-yellow-500' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
            </svg>
            <h2 className='text-xl font-bold text-gray-900'>Your Feedback</h2>
          </div>

          {!canRate && (
            <div className='flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
              <svg className='w-5 h-5 text-yellow-600 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <div>
                <h4 className='font-semibold text-yellow-900 mb-1'>Feedback Not Available</h4>
                <p className='text-sm text-yellow-800'>
                  You can rate and provide feedback after the complaint is marked as Completed.
                </p>
              </div>
            </div>
          )}

          {canRate && c.rating && !editing ? (
            <div>
              <div className='flex items-center gap-3 mb-4'>
                <StarRating value={rating} />
                <span className='text-lg font-semibold text-gray-700'>{rating}/5</span>
              </div>
              {feedback && (
                <div className='mb-4'>
                  <h4 className='text-sm font-bold text-gray-700 mb-2'>Your Comments</h4>
                  <p className='text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap'>
                    {feedback}
                  </p>
                </div>
              )}
              <Button variant='outline' onClick={() => setEditing(true)}>
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                </svg>
                Edit Feedback
              </Button>
            </div>
          ) : canRate ? (
            <div>
              <div className='mb-4'>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Rating</label>
                <div className='flex items-center gap-3'>
                  <StarRating value={rating} onChange={setRating} />
                  <span className='text-lg font-semibold text-gray-700'>{rating}/5</span>
                </div>
              </div>
              <div className='mb-6'>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Comments (Optional)</label>
                <textarea
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                  rows={4}
                  placeholder='Share your experience with the resolution...'
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
              </div>
              <div className='flex gap-3'>
                <Button onClick={save} loading={saving}>
                  <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  {c.rating ? 'Update Feedback' : 'Submit Feedback'}
                </Button>
                {c.rating && (
                  <Button
                    variant='outline'
                    onClick={() => {
                      setEditing(false);
                      load();
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
