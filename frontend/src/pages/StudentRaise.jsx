import React, {useState} from 'react'; import api from '../services/api'; import { useNavigate } from 'react-router-dom'; import Button from '../components/Button';
export default function StudentRaise(){ const [form,setForm]=useState({title:'',description:'',category:'Electrician',isAnonymous:false,roomNo:''}); const nav = useNavigate(); const [busy,setBusy]=useState(false);
  const submit = async (e) => { e.preventDefault(); if(!form.title?.trim()){return alert('Please enter a title');} setBusy(true); try { await api.post('/complaints/raise', form); nav('/student/history'); } catch(err){ alert(err?.response?.data?.message || 'Error raising complaint'); } finally{ setBusy(false); } };
  return (<div className='max-w-xl mx-auto'><h2 className='text-xl mb-2'>Raise Complaint</h2><form onSubmit={submit} className='space-y-2'>
    <input className='border p-2 w-full' placeholder='Title' value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
    <textarea className='border p-2 w-full' placeholder='Description' rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea>
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
      <select className='border p-2 w-full' value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Electrician</option><option>Plumber</option><option>Carpenter</option><option>Cleaner</option><option>Maintenance</option><option>Other</option></select>
      <input className='border p-2 w-full' placeholder='Room No' value={form.roomNo} onChange={e=>setForm({...form,roomNo:e.target.value})} />
    </div>
    <label className='inline-flex items-center'><input type='checkbox' checked={form.isAnonymous} onChange={e=>setForm({...form,isAnonymous:e.target.checked})} className='mr-2'/> Raise anonymously</label>
    <Button variant='success' loading={busy}>Submit</Button>
  </form></div>); }
