import mongoose from "mongoose";
import validator from 'validator';

const applicationSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        minLength: [3, 'name must contain atleast 3 characters'],
        maxLength: [30, 'name cannot exceed 30 characters'],
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please enter a valid email id!'],
    },
    coverLetter: {
        type: String,
        required: [true, 'Please provide your cover letter'],
    },
    phone: {
        type: Number,
        required: [true, 'Please provide your phone no']
    },
    address: {
        type: String,
        required: [true, 'Please enter complete address'],
        minLength: [30, 'address must contain atleast 30 characters'],
        maxLength: [70, 'address cannot exceed 50 characters']
    },
    resume: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
            required: [true, 'Please upload your resume'],
        }
    },
    applicantId: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            enum: ['job seeker'],
            required: true
        },
    },
    employerId: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            enum: ['Employer'],
            required: true
        },
    },
});

export const JobApplication = mongoose.model('JobApplication', applicationSchema);
