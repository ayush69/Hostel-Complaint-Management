# Backend Deployment Guide

## Prerequisites
- ✅ MongoDB Atlas database (already set up)
- ✅ Backend code converted to ES modules
- ✅ Frontend deployed (update FRONTEND_URL below)

## Option 1: Deploy to Render (Recommended - Free)

### Step 1: Prepare Your Repository
```bash
cd backend
git add .
git commit -m "Prepare backend for deployment"
git push
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Grant access to your repository

### Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository: `Hostel-Complaint-Management`
4. Configure:
   - **Name**: `hcm-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 4: Add Environment Variables
In Render dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://ayush295887:ayush9580@cluster0.vv0l9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

FRONTEND_URL=https://your-frontend-url.vercel.app

JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345

PORT=5000

SEED_ADMIN_EMAIL=admin@hcm.local

SEED_ADMIN_PASSWORD=password123
```

⚠️ **Important**: Update `FRONTEND_URL` with your actual deployed frontend URL!

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Your backend will be live at: `https://hcm-backend-xxxx.onrender.com`

### Step 6: Seed Admin User
After deployment, go to Render dashboard → Shell and run:
```bash
npm run seed
```

---

## Option 2: Deploy to Vercel (Serverless)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy from Backend Directory
```bash
cd backend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? `hcm-backend`
- Directory? `./` (current directory)
- Override settings? **N**

### Step 4: Add Environment Variables
```bash
vercel env add MONGODB_URI
vercel env add FRONTEND_URL
vercel env add JWT_SECRET
vercel env add SEED_ADMIN_EMAIL
vercel env add SEED_ADMIN_PASSWORD
```

For each variable, enter the value when prompted and select "Production".

### Step 5: Deploy to Production
```bash
vercel --prod
```

Your backend will be live at: `https://hcm-backend.vercel.app`

---

## Option 3: Deploy to Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login and Initialize
```bash
railway login
cd backend
railway init
```

### Step 3: Add Environment Variables
```bash
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set FRONTEND_URL="your-frontend-url"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set SEED_ADMIN_EMAIL="admin@hcm.local"
railway variables set SEED_ADMIN_PASSWORD="password123"
```

### Step 4: Deploy
```bash
railway up
```

---

## After Deployment - Update Frontend

Once your backend is deployed, update your frontend's API URL:

### If Frontend is on Vercel:
1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add or update:
   ```
   VITE_API_BASE=https://your-backend-url.onrender.com/api
   ```
3. Redeploy frontend

### Or update frontend `.env`:
```env
VITE_API_BASE=https://your-backend-url.onrender.com/api
```

---

## Testing Your Deployment

### 1. Test Health Endpoint
```bash
curl https://your-backend-url.onrender.com/
```

Should return: `{"ok":true,"now":"..."}`

### 2. Test Login Endpoint
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hcm.local","password":"password123"}'
```

Should return a token.

### 3. Test Full Flow
1. Open your deployed frontend
2. Login as admin/student/staff
3. Try creating complaints, assigning tasks, etc.

---

## Important Security Notes

### 1. Change JWT Secret in Production
Generate a strong random secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update the `JWT_SECRET` environment variable in your deployment platform.

### 2. Update CORS Configuration
Make sure `FRONTEND_URL` in environment variables matches your deployed frontend URL exactly (including https://).

### 3. Database Security
- ✅ Your MongoDB is already secured with authentication
- Ensure only your backend IP can access (MongoDB Atlas Network Access)

### 4. Environment Variables
Never commit `.env` file to Git (already in .gitignore).

---

## Troubleshooting

### Backend returns 500 errors
- Check environment variables are set correctly
- Check MongoDB connection string is valid
- Check logs in deployment platform

### CORS errors
- Verify `FRONTEND_URL` matches your deployed frontend URL exactly
- Include `https://` protocol

### Database connection fails
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Render IP
- Verify connection string is correct

### Port binding errors
- Render automatically provides PORT variable
- Your app uses `process.env.PORT || 5000` (already configured)

---

## Recommended: Render + Vercel Setup

**Backend**: Render (better for long-running Node.js apps)
**Frontend**: Vercel (already deployed)

This combination is free and works great for full-stack apps!

---

## Next Steps After Deployment

1. ✅ Deploy backend (follow steps above)
2. ✅ Update frontend with backend URL
3. ✅ Seed admin user
4. ✅ Test all features
5. ✅ Share with users!

---

Need help? Common issues:
- Backend not starting: Check logs in platform dashboard
- Database connection: Verify MongoDB URI
- CORS issues: Update FRONTEND_URL
- Routes not working: Ensure ES modules are properly configured (already done)
