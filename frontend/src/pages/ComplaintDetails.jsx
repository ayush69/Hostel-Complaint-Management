import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

export default function ComplaintDetails(){
  const { id } = useParams();
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [editing, setEditing] = useState(false);
  const load = async () => { try { const r = await api.get(`/complaints/${id}/details`); setC(r.data.complaint); setRating(r.data.complaint.rating || 0); setFeedback(r.data.complaint.feedback || ''); } catch { toast.error('Not found'); nav(-1); } };
  useEffect(()=>{ load(); // eslint-disable-next-line
  },[id]);
  if (!c) return <div className='p-4'>Loading...</div>;
  const canRate = c.status === 'Completed';
  const save = async () => {
    try {
      await api.put(`/complaints/${id}/rate`, { rating, feedback });
      toast.success('Feedback saved');
      setEditing(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error saving');
    }
  };
  return (
    <div className='max-w-2xl mx-auto p-4'>
      <div className='mb-3'><button className='underline' onClick={()=>nav(-1)}>Back</button></div>
      <div className='card p-4'>
        <div className='text-xl font-semibold'>{c.title}</div>
        <div className='text-sm text-gray-600'>{c.category} · {c.status}</div>
        <div className='mt-2 whitespace-pre-wrap'>{c.description}</div>
        <div className='mt-2 text-sm'>Room: {c.roomNo || '-'}</div>
        {c.assignedStaffId && (
          <div className='mt-2 text-sm'>Assigned to: {c.assignedStaffId.name} ({c.assignedStaffId.category})</div>
        )}
      </div>
      <div className='card p-4 mt-4'>
        <div className='font-semibold mb-2'>Your feedback</div>
        {!canRate && <div className='text-sm text-gray-500'>You can rate after the complaint is marked Completed.</div>}
        {canRate && c.rating && !editing ? (
          <div>
            <div className='flex items-center gap-2'>
              <StarRating value={rating} />
              <span className='text-sm text-gray-600'>{rating}/5</span>
            </div>
            <div className='mt-2 text-sm whitespace-pre-wrap'>{feedback || '—'}</div>
            <button className='mt-2 px-4 py-2 bg-gray-200 rounded' onClick={()=>setEditing(true)}>Edit</button>
          </div>
        ) : (
          <div>
            <div className='flex items-center gap-2'>
              <StarRating value={rating} onChange={canRate ? setRating : undefined} />
              {canRate && <span className='text-sm text-gray-600'>{rating}/5</span>}
            </div>
            <textarea disabled={!canRate} className='border p-2 w-full mt-2' rows={3} placeholder='Feedback' value={feedback} onChange={e=>setFeedback(e.target.value)} />
            {canRate && (
              <div className='flex gap-2 mt-2'>
                <button onClick={save} className='px-4 py-2 bg-blue-600 text-white rounded'>{c.rating ? 'Update' : 'Save'}</button>
                {c.rating && <button className='px-4 py-2 bg-gray-200 rounded' onClick={()=>{ setEditing(false); load(); }}>Cancel</button>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
