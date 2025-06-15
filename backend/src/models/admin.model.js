import mongoose from "mongoose";
import { Schema } from "mongoose";

const AdminSchema = new Schema({

    name: {
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
    studentsList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    staffList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        }
    ],
    complaintsList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint'
        }
    ],

}, { timestamps: true });

export const Admin = mongoose.model("Admin", AdminSchema);