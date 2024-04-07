import wrapAsync from "../middlewares/wrapAsync.js";
import ErrorHandler from "../middlewares/error.js";
import { JobApplication } from "../models/applicationSchema.js";
import cloudinary from 'cloudinary';
import { Job } from "../models/jobSchema.js";

// route for employer to access all job applications

export const employerGetAllJobApplications = wrapAsync(async (req, res, next) => {

    const {role} = req.user;

    if (role === 'Job seeker') {
        return next(new ErrorHandler('Job seeker are not allowed to access these resources', 400))
    };

    const {_id} = req.user;
    const applications = await JobApplication.find({'employerId.user': _id});

    res.status(200).json({
        success: true,
        applications
    });
});


export const jobSeekerGetAllJobApplications = wrapAsync(async (req, res, next) => {
    const {role} = req.user;

    if (role === 'Employer') {
        return next(new ErrorHandler('Employer are not allowed to access these resources', 400))
    };

    const {_id} = req.user;
    const applications = await JobApplication.find({'applicantId.user': _id});

    res.status(200).json({
        success: true,
        applications
    });
});


export const jobSeekerDeleteApplication = wrapAsync(async(req, res, next) => {
    const {role} = req.user;

    if (role === 'Employer') {
        return next(new ErrorHandler('Employer are not allowed to access these resources', 400))
    };

    const {id} = req.params;
    const application = await JobApplication.findById(id);

    if (!application) {
        return next('Oops..Job not found', 404);
    }  

    if (!req.user._id.equals(application.applicantId.user)) {   //imortant while comparing object instances
        return next(new ErrorHandler('Job can be deleted by its applicant only!'))
    }

await JobApplication.findByIdAndDelete(id); 

    res.status(200).json({
        success: true,
        message: 'job application has been deleted successfully!'
    });
});

export const postApplication = wrapAsync(async(req, res, next) => {
    const {role} = req.user;

    if (role === 'Employer') {
        return next(new ErrorHandler('Employer are not allowed to access these resources', 400))
    };
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('Resume File Required'));
    };

    const {resume} = req.files;
    const allowedFormats = ['image/png', 'image/jpg', 'image/webp', 'image/jpeg'];

    if (!allowedFormats.includes(resume.mimetype)) {
        return next(new ErrorHandler('Invalid file type. Please upload resume in png, jpg, or webp format only'));
    };

    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    if(!cloudinaryResponse || cloudinaryResponse.error) {

        console.error(
            cloudinaryResponse.error || 'Unknown cloudinary error'
        )
    return next(new ErrorHandler('Falied to upload resume', 500))
    };
    
    const {name, email, phone, address, coverLetter, jobId} = req.body;

    const applicantId = {
        user: req.user._id,
        role: 'job seeker' 
    };

    if (!jobId) {
        return next(new ErrorHandler('Job not found', 404));
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler('Job not found', 404));

    };

    const employerId = {
        user: jobDetails.postedBy,
        role: 'Employer'
    };

    if (!name || !email || !address || !phone || !coverLetter || !applicantId || !employerId) {
        return next(new ErrorHandler('Please provide complete applicant details'));
    }

    const application = await JobApplication.create({
        name, email, address, phone, coverLetter, applicantId, employerId, resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: 'Job application has been posted successfully',
        application
    });
});

