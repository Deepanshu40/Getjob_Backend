import mongoose from "mongoose";

const jobSchema = new mongoose.Schema ({

    title : {
        type : String,
        required : [true, 'Please provide job Title'],
        minLength : [3, 'Title should contain minimum 3 characters'],
        maxLength : [50, 'Job Title cannot exceed 50 characters'],
    },
    description : {
        type: String,
        required: [true, 'Please provide job description'],
        minLength : [20, 'Description should contain minimum 50 characters'],
        maxLength : [350, 'Job Title cannot exceed 350 characters'],
    },
    category: {
        type: String,
        required: [true, 'Job Category is required'],
    },
    country : {
        type : String,
        required: [true, 'Job Country country name'],
    },
    city: {
        type : String,
        required : [true, 'Job City is required'],
    },
    location: {
        type : String,
        required : [true, 'Please provide exact location!'],
        minLength: [5, 'Job location must contain minimum 5 characters'],
    },
    fixedSalary : {
        type : Number,
        minLength: [4, 'Fixed salary must be in atleast 4 digits!'],
        maxLength: [9, 'Fixed salary cannot exceed 9 digits!'],
    },
    salaryFrom : {
        type : Number,
        minLength: [4, 'Salary from must be in atleast 4 digits!'],
        maxLength: [9, 'Salary from cannot exceed 9 digits!'],
    },
    salaryTo : {
        type : Number,
        minLength: [4, 'Salary to must be in atleast 4 digits!'],
        maxLength: [9, 'Salary to cannot exceed 9 digits!'],
    },
    expired : {
        type : Boolean,
        default : false
    },
    jobPostedOn : {
        type : Date,
        default : Date.now(),
    },
    postedBy : {
        type : mongoose.Schema.ObjectId,
        ref: 'User',
        required : true,
    },
})

export const Job = mongoose.model('Job', jobSchema);
