# Hostel Complaint Management - Backend

## Overview
Express.js REST API for managing hostel complaints, staff assignments, student fines, and administrative operations.

## Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas cloud or local)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (Atlas account or local installation)
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   The `.env` file has been created with:
   ```env
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-secret-key-here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   SEED_ADMIN_EMAIL=admin@hcm.local
   SEED_ADMIN_PASSWORD=password123
   ```

3. **Seed the admin account:**
   ```bash
   npm run seed
   ```

## Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Student Auth
- `POST /api/auth/student/register` - Register new student
- `POST /api/auth/student/login` - Student login

#### Staff Auth
- `POST /api/auth/staff/login` - Staff login

#### Admin Auth
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/admin/create-staff` - Create staff member (Admin only)

### Complaints
- `POST /api/complaints/raise` - Raise new complaint (Student)
- `GET /api/complaints/student/history` - Get student's complaints (Student)
- `GET /api/complaints/:id/details` - Get complaint details
- `PUT /api/complaints/:id/rate` - Rate completed complaint (Student)

### Admin Routes
- `GET /api/admin/dashboard` - Get dashboard statistics ✨ **NEW**
- `GET /api/admin/complaints/pending` - Get pending complaints
- `PUT /api/admin/complaints/:id/assign` - Assign staff to complaint
- `PUT /api/admin/complaints/:id/reject` - Reject complaint ✨ **NEW**
- `GET /api/admin/complaints` - Get all complaints with filters
- `GET /api/admin/students` - Get all students
- `GET /api/admin/students/:id` - Get student details
- `PUT /api/admin/students/:id` - Update student
- `GET /api/admin/staff` - Get all staff members
- `GET /api/admin/staff/:id` - Get staff details
- `PUT /api/admin/staff/:id` - Update staff member
- `POST /api/admin/fines/impose` - Impose fine on student

### Staff Routes
- `GET /api/staff/assigned-complaints` - Get assigned complaints
- `PUT /api/staff/complaints/:id/update-status` - Update complaint status

### Student Routes
- `GET /api/student/dashboard` - Get dashboard statistics
- `GET /api/student/fines` - Get student's fines

## Project Structure
```
backend/
├── src/
│   ├── middleware/
│   │   ├── auth.js          # Authentication middleware
│   │   └── error.js         # Error handler
│   ├── models/
│   │   ├── Admin.js         # Admin schema
│   │   ├── Complaint.js     # Complaint schema ✅ Fixed
│   │   ├── Fine.js          # Fine schema
│   │   ├── Staff.js         # Staff schema ✅ Fixed
│   │   └── Student.js       # Student schema
│   ├── routes/
│   │   ├── admin.js         # Admin routes ✅ Enhanced
│   │   ├── authAdminStaff.js # Admin/Staff auth
│   │   ├── authStudent.js   # Student auth
│   │   ├── complaints.js    # Complaint routes ✅ Enhanced
│   │   ├── staff.js         # Staff routes ✅ Enhanced
│   │   └── student.js       # Student routes ✅ Enhanced
│   ├── utils/
│   │   ├── db.js           # MongoDB connection
│   │   ├── hash.js         # Password hashing
│   │   ├── jwt.js          # JWT utilities
│   │   └── seedAdmin.js    # Admin seeding script
│   └── server.js           # Express app entry point
├── .env                    # Environment variables ✅ Created
├── nodemon.json           # Nodemon config
├── package.json           # Dependencies
└── README.md             # This file
```

## Database Models

### Student
- name, email, password, rollNo, branch, phoneNumber, roomNo, year
- currentFines (array of Fine IDs)

### Staff
- name, email, password, category, phoneNumber, address, **offDay** (flexible string)
- deleted (soft delete flag)

### Admin
- name, email, password, role (Warden/Caretaker), phoneNumber

### Complaint
- title, description, category, isAnonymous, studentId, roomNo
- status (**Pending/Assigned/InProgress/Completed/Rejected**)
- assignedStaffId, rating, feedback

### Fine
- studentId, amount, reason, status (Paid/Unpaid)
- imposedBy (Admin ID)

## Authentication
Uses JWT tokens with Bearer authentication:
```
Authorization: Bearer <token>
```

Token payload:
```json
{
  "id": "user_id",
  "role": "student|staff|admin",
  "name": "User Name"
}
```

## Error Handling
All routes include try-catch blocks and return:
```json
{
  "message": "Error description"
}
```

## Default Admin Credentials
After running `npm run seed`:
- Email: `admin@hcm.local` (or from .env)
- Password: `password123` (or from .env)

## Issues Fixed ✅

### Critical Issues
1. ✅ **Added missing Admin Dashboard endpoint** (`GET /api/admin/dashboard`)
   - Returns stats for pending complaints, total complaints, students, staff
   
2. ✅ **Added Complaint Rejection** (`PUT /api/admin/complaints/:id/reject`)
   - Admins can now reject complaints

3. ✅ **Fixed Staff Model** - offDay field
   - Changed from strict enum to flexible string
   - Allows any day format (e.g., "Sunday", "Monday", etc.)

4. ✅ **Fixed Complaint Model** - Added 'Rejected' status
   - Status now: Pending/Assigned/InProgress/Completed/Rejected

### Enhancements
5. ✅ **Added comprehensive error handling** to all routes
   - Try-catch blocks in all async operations
   - Better error messages

6. ✅ **Added student data population** in staff routes
   - Staff can now see student details in assigned complaints

7. ✅ **Added validation** for status updates
   - Staff can only update to valid statuses

8. ✅ **Added sorting** to fines endpoint
   - Fines now sorted by creation date (newest first)

## Troubleshooting

### MongoDB Connection Error
- Check `MONGODB_URI` in `.env` file
- Ensure MongoDB Atlas IP whitelist includes your IP
- Test connection string in MongoDB Compass

### JWT Errors
- Ensure `JWT_SECRET` is set in `.env`
- Check Authorization header format: `Bearer <token>`

### Port Already in Use
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in .env
PORT=5001
```

### Dependencies Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Testing the Backend

### Health Check
```bash
curl http://localhost:5000/
```

Should return:
```json
{
  "ok": true,
  "now": "2025-10-19T..."
}
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hcm.local","password":"password123"}'
```

## License
MIT
