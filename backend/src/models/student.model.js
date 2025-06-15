import { Schema } from "mongoose";
import mongoose from "mongoose";
import { Complaint } from "./complaint.model.js";


const StudentSchema = new Schema({

    fullName: {
        type: String,
        required: true,

    },
    RollNo: {
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
    programme: {
        type: String,
        required: true,
        enum: ['B.Tech', 'M.Tech', 'B.Des', 'M.Des', 'Phd', 'Other']
    },
    RoomNo: {
        type: String,
        required: true,
        minLength: 3
    },
    Hostel: {
        type: String,
        required: true,
        minLength: 8
    },
    mobileNo: {
        type: Number,
        required: true,
        minLength: 10
    },
    complaints: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint"
        }
    ],

}, { timestamps: true });


export const Student = mongoose.model("Student", StudentSchema);