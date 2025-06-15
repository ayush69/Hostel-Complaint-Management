import { Complaint } from '../models/complaint.model.js';

// Create a new complaint
export const createComplaint = async (req, res) => {
    try {
        const { by, roomNo, type, description, photos } = req.body;
        console.log('Received Data:', req.body);
        
        // Basic validation
        if (!by || !roomNo || !type || !description) {
            return res.status(400).json({ error: 'All required fields must be provided.' });
        }

        // Creating a new complaint
        const newComplaint = new Complaint({
            by,
            roomNo,
            type,
            description,
            photos
        });

        // Save to database
        await newComplaint.save();

        res.status(201).json({ message: 'Complaint submitted successfully', complaint: newComplaint });
    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
};