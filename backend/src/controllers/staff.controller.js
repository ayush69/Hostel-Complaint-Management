import { Staff } from "../models/staff.model.js";
import bcrypt from "bcrypt";

// Create a new staff member
export const createStaff = async (req, res) => {
    try {
        const { fullName, staffId, email, password, mobileNo, jobCategory, offDay } = req.body;

        // Basic validation
        if (!fullName || !staffId || !email || !password || !mobileNo || !jobCategory || !offDay) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        // Check if staff ID or email already exists
        const existingStaff = await Staff.findOne({ $or: [{ staffId }, { email }] });
        if (existingStaff) {
            return res.status(400).json({ error: "Staff with this ID or email already exists." });
        }

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

         // Creating a new staff member
         const newStaff = new Staff({
            fullName,
            staffId,
            email,
            password: hashedPassword,
            mobileNo,
            jobCategory,
            offDay
        });

        // Save to database
        await newStaff.save();

        res.status(201).json({ message: "Staff added successfully", staff: newStaff });
    } catch (error) {
        console.error("Error creating staff:", error);
        res.status(500).json({ error: "Server error, please try again later." });
    }
};
