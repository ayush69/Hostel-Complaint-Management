import React from 'react';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  ghost: 'bg-transparent text-gray-800 hover:bg-gray-100'
};

const sizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-5 py-3 text-lg'
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}){
  const cls = `rounded transition ${variants[variant]} ${sizes[size]} ${className} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}`;
  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading ? 'Please wait...' : children}
    </button>
  );
}
