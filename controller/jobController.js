import { Job } from "../models/jobSchema.js";
import wrapAsync from "../middlewares/wrapAsync.js";
import ErrorHandler, { errorHandler } from "../middlewares/error.js";

// show all jobs
export const getAllJobs = wrapAsync(async(req, res, next) => {
    const jobs = await Job.find({expired : false});
    res.status(200).json({
        success : true,
        jobs
    });
});

// create a job
export const postJob = wrapAsync(async (req, res, next) => {
   const {role} = req.user;

   if (role === 'job seeker') {
    return next(new ErrorHandler('Job seeker are not allowed to access these resources', 400));
   };

   const {title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo} = req.body;

   if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler('Please provide full job details!'));
   };

   if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(new ErrorHandler('Please provide either fixed salary or ranged salary!'));
   };

   if (salaryFrom && salaryTo && fixedSalary) {
    return next(new ErrorHandler('You can provide both type of salary!'));
   };

   const postedBy = req.user._id;
   const job = await Job.create({title, description, category, country, city, location, salaryFrom, salaryTo, fixedSalary, postedBy});

   res.status(200).json({
    success: true,
    message : 'job posted successfully',
    job,
   });
});

// showing a job
export const getMyJob = wrapAsync(async (req, res, next) => {
    const {role} = req.user;

    if (role === 'job seeker') {
        return next(new ErrorHandler('Job seeker are not allowed to access these resources', 400));
    };

    const myJobs = await Job.find({postedBy: req.user._id});

    res.status(200).json({
        success : true,
        myJobs,
    });  
});

//  job update handler
export const updateJob = wrapAsync(async(req, res, next) => {
    const {role} = req.user;

    if (role === 'job seeker') {
        return next(new ErrorHandler('Job seeker are not allowed to access these resources', 400));
    };

    const {id} = req.params;
    let job = await Job.findById(id);

    if (!job) {
        return next('Oops..Job not found', 404);
    }  

      let fixedSalary = req.body.fixedSalary || null;
      let salaryFrom = req.body.salaryFrom || null;
      let salaryTo = req.body.salaryTo  || null;

      if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(new ErrorHandler('Please provide either fixed salary or ranged salary!'));
       };
    
       if (salaryFrom && salaryTo && fixedSalary) {
        return next(new ErrorHandler('You cannot provide both type of salary!'));
       };
    
    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: 'true',
        message: 'Job has been updated successfully',
        job,
    });
});

// deleteJob middleware
export const deleteJob = wrapAsync(async (req, res, next) => {
    const {role} = req.user

    if (role === 'job seeker') {
        return next(new ErrorHandler('Job seeker are not allowed to access these resources', 400));
    };

    const {id} = req.params;

    let job = await Job.findById(id);

    if (!job) {
        return next('Oops..Job not found', 404);
    }  

    if (!req.user._id.equals(job.postedBy)) {   //imortant while comparing object instances
    // if (req.user._id !== job.postedBy._id) {
        return next(new ErrorHandler('Job can be deleted by its Employer only!'))
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Job has been deleted successfully'
    });
});


export const getSingleJob = wrapAsync( async (req, res, next) => {

    let {id} = req.params;
    let job = await Job.findById(id);

    if (!job) {
        return next('Oops..Job not found', 404);
    }  

    res.status(200).json({
        success: true,
        job,
    })
})