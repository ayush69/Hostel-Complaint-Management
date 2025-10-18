# API Troubleshooting Guide

## ✅ Verified Working Components

### Backend (Port 5000)
- ✅ Server is running on port 5000 (Process ID: 9684)
- ✅ All required endpoints exist and match frontend calls
- ✅ CORS configured correctly for http://localhost:5173
- ✅ Authentication middleware working

### Frontend (Port 5173)
- ✅ Dev server running on port 5173
- ✅ Axios configured with correct baseURL
- ✅ Token interceptor adding Bearer token to requests
- ✅ All API calls using correct endpoint paths

### Verified Endpoints

| Frontend Call | Backend Route | Status |
|--------------|---------------|--------|
| POST `/complaints/raise` | ✅ `/api/complaints/raise` | EXISTS |
| GET `/complaints/student/history` | ✅ `/api/complaints/student/history` | EXISTS |
| PUT `/admin/complaints/:id/assign` | ✅ `/api/admin/complaints/:id/assign` | EXISTS |
| GET `/student/fines` | ✅ `/api/student/fines` | EXISTS |
| PUT `/complaints/:id/rate` | ✅ `/api/complaints/:id/rate` | EXISTS |

## 🔍 Common Issues & Solutions

### Issue 1: "Not authenticated" or 401 errors
**Cause:** No valid JWT token in localStorage

**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.getItem('hcm_token')`
4. If it returns `null`, you need to log in again
5. Navigate to appropriate login page:
   - Student: `/student/login`
   - Staff: `/staff/login`
   - Admin: `/admin/login`

### Issue 2: Token expired
**Cause:** JWT token has expired (check backend JWT_SECRET hasn't changed)

**Solution:**
1. Clear the token: `localStorage.removeItem('hcm_token')`
2. Log in again

### Issue 3: Network errors / "Failed to fetch"
**Cause:** Backend not running or wrong port

**Solution:**
1. Verify backend is running: `netstat -ano | findstr :5000`
2. If not running, start it:
   ```powershell
   cd backend
   npm run dev
   ```

### Issue 4: CORS errors
**Cause:** Frontend URL not allowed by backend

**Solution:**
Already fixed! Backend .env has:
```
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing Steps

### Step 1: Test Backend Directly
Open PowerShell and test an endpoint:

```powershell
# Test health check
curl http://localhost:5000

# Test student login (should work without token)
curl -X POST http://localhost:5000/api/auth/student/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@student.com","password":"password123"}'
```

### Step 2: Check Browser Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try to perform an action (e.g., raise complaint)
4. Look for the request:
   - **Red** = Failed (check status code)
   - **200-299** = Success
   - **401** = Not authenticated
   - **403** = Forbidden (wrong role)
   - **404** = Endpoint not found
   - **500** = Server error

### Step 3: Check Console for Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Common errors:
   - `401 Unauthorized` = Need to log in
   - `Network Error` = Backend not running
   - `CORS error` = Backend CORS issue (already fixed)

### Step 4: Verify Token in Request
1. Open DevTools > Network tab
2. Click on any API request
3. Go to "Headers" section
4. Check "Request Headers"
5. Should see: `Authorization: Bearer eyJhbG...`
6. If missing, check localStorage has 'hcm_token'

## 🔧 Quick Fixes

### Clear Everything and Restart
```powershell
# In one terminal - Backend
cd "c:\Users\hp\Desktop\hcm2 latest\backend"
npm run dev

# In another terminal - Frontend
cd "c:\Users\hp\Desktop\hcm2 latest\frontend"
npm run dev
```

Then in browser:
1. Open http://localhost:5173
2. Press F12 (DevTools)
3. Go to Application tab > Storage > Local Storage
4. Clear all (delete 'hcm_token')
5. Go to appropriate login page
6. Login with valid credentials
7. Try the action again

### Test Each Problematic Feature

#### Student Raise Complaint
1. Login as student
2. Go to "Raise Complaint" page
3. Fill the form
4. Open DevTools > Network tab before submitting
5. Click Submit
6. Check network request:
   - URL should be: `http://localhost:5000/api/complaints/raise`
   - Method: POST
   - Status: 200 (success)

#### Student History
1. Login as student
2. Go to "My Complaints" page
3. Check Network tab:
   - URL: `http://localhost:5000/api/complaints/student/history`
   - Method: GET
   - Status: 200

#### Admin Assign
1. Login as admin
2. Go to pending complaints
3. Click "Assign" on a complaint
4. Select staff member
5. Check Network tab:
   - URL: `http://localhost:5000/api/admin/complaints/{id}/assign`
   - Method: PUT
   - Status: 200

#### Student Fines
1. Login as student
2. Go to "Fines" page
3. Check Network tab:
   - URL: `http://localhost:5000/api/student/fines`
   - Method: GET
   - Status: 200

#### Rating (After complaint completed)
1. Login as student
2. Go to completed complaint details
3. Give a rating
4. Check Network tab:
   - URL: `http://localhost:5000/api/complaints/{id}/rate`
   - Method: PUT
   - Status: 200

## 🐛 Debug Mode

Add this to any page to see what's happening:

```javascript
// Add at top of component
useEffect(() => {
  console.log('Current user token:', localStorage.getItem('hcm_token'));
  console.log('API base URL:', import.meta.env.VITE_API_BASE || 'http://localhost:5000/api');
}, []);
```

## 📝 Expected Behavior

### Working Flow:
1. User logs in → Gets JWT token → Stored in localStorage
2. User performs action → axios interceptor adds token to header
3. Backend validates token → Returns data
4. Frontend displays data

### If any step fails:
- **Step 1 fails:** Login credentials wrong or backend error
- **Step 2 fails:** axios not configured properly (already fixed)
- **Step 3 fails:** Token invalid/expired or backend auth issue
- **Step 4 fails:** Frontend error handling issue

## 🎯 Most Likely Issue

Based on "endpoints not hitting", the most likely causes are:

1. **User not logged in** (no token in localStorage)
   - Solution: Login again

2. **Token expired** (if JWT_SECRET changed in backend)
   - Solution: Clear token and login again

3. **Backend restarted with new JWT_SECRET** (tokens from old secret invalid)
   - Solution: Have all users logout and login again

## 🚀 Quick Test Command

Run this in browser console while on the site:

```javascript
// Test if token exists
console.log('Token:', localStorage.getItem('hcm_token'));

// Test API call manually
fetch('http://localhost:5000/api/student/dashboard', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('hcm_token')
  }
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

If this works, the API is fine and the issue is in the React component.
If this fails with 401, you need to login again.
If this fails with network error, backend isn't running.
