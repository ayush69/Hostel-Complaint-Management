export const setToken = t => localStorage.setItem('hcm_token', t);
export const getToken = () => localStorage.getItem('hcm_token');
export const clearToken = () => localStorage.removeItem('hcm_token');

const base64UrlDecode = (str) => {
	try {
		const pad = '='.repeat((4 - (str.length % 4)) % 4);
		const base64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
		const json = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
		return JSON.parse(json);
	} catch { return null; }
};

export const getUser = () => {
	const t = getToken(); if (!t) return null;
	const parts = t.split('.'); if (parts.length !== 3) return null;
	const payload = base64UrlDecode(parts[1]);
	if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) return null;
	return payload; // expected fields: id, role, name
};

export const getRole = () => (getUser()?.role || null);