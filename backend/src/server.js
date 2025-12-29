import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import errorHandler from './middleware/error.js';
import authStudentRouter from './routes/authStudent.js';
import authAdminStaffRouter from './routes/authAdminStaff.js';
import complaintsRouter from './routes/complaints.js';
import adminRouter from './routes/admin.js';
import staffRouter from './routes/staff.js';
import studentRouter from './routes/student.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

// connect DB
connectDB();

// routes
app.use('/api/auth/student', authStudentRouter);
app.use('/api/auth', authAdminStaffRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/staff', staffRouter);
app.use('/api/student', studentRouter);

// health
app.get('/', (req,res) => res.json({ ok:true, now: new Date() }));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));

// Crash handlers so nodemon can restart on fatal errors
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Rejection:', reason);
	// Give the logs a moment to flush then exit for nodemon to restart
	setTimeout(() => process.exit(1), 100);
});
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	setTimeout(() => process.exit(1), 100);
});
