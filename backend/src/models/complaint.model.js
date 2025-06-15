import {Schema} from 'mongoose';
import mongoose from 'mongoose';

const ComplaintSchema = new Schema({

    by: {
        type: String,
        required: true,
    },
    roomNo: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['electricity', 'water', 'cleaning', 'other']
    },
    description: {
        type: String,
        required: true,
        minLength: 10
    },
    photos: {
        type: Array,
        default: [],
        maxLength: 4
    },
    status: {
        type: String,
        // required: true,
        enum: ['pending', 'assigned', 'completed'],
        default: 'pending'
    },
    assignedTo: {
        type: String,
        default: 'not yet assigned'
    }

}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', ComplaintSchema);