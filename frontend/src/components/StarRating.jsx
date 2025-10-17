import React from 'react';
export default function StarRating({value=0, onChange}){ return (<div>{Array.from({length:5}).map((_,i)=> (<button type='button' key={i} onClick={()=>onChange && onChange(i+1)} className='text-lg'>{i < value ? '★' : '☆'}</button>))}</div>); }
