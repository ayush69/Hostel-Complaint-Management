import mongoose from "mongoose";
import { Schema } from "mongoose";


const StaffSchema = new Schema({

    fullName: {
        type: String,
        required: true,
    },
    staffId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        minLength: 10
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    mobileNo: {
        type: Number,
        required: true,
        minLength: 10
    },
    jobCategory: {
        type: String,
        required: true,
        enum: ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Gardener', 'Cleaner', 'Security Guard', 'Other']
    },
    offDay: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true,
    },
    jobsAssigned: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint'
        }
    ]

}, { timestamps: true });

export const Staff = mongoose.model("Staff", StaffSchema);