import axios from 'axios';

const api = axios.create({ 
	baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api', 
	headers: { 'Content-Type': 'application/json' } 
});

// Request interceptor - adds auth token
api.interceptors.request.use(cfg => { 
	const t = localStorage.getItem('hcm_token'); 
	if (t) cfg.headers.Authorization = `Bearer ${t}`;
	return cfg; 
});

// Response interceptor - handles auth errors
api.interceptors.response.use(r => r, err => {
	if (err.response && err.response.status === 401) {
		localStorage.removeItem('hcm_token');
		const p = window.location.pathname || '';
		if (p.startsWith('/admin')) window.location.href = '/admin/login';
		else if (p.startsWith('/staff')) window.location.href = '/staff/login';
		else window.location.href = '/student/login';
	}
	return Promise.reject(err);
});

export default api;
