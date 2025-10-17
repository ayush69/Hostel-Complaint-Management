const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const errorHandler = require('./middleware/error');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
// connect DB
connectDB();
// routes
app.use('/api/auth/student', require('./routes/authStudent'));
app.use('/api/auth', require('./routes/authAdminStaff'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/student', require('./routes/student'));
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
