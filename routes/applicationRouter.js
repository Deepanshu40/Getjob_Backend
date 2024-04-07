import express from 'express';
import { employerGetAllJobApplications, jobSeekerGetAllJobApplications, jobSeekerDeleteApplication, postApplication } from '../controller/jobApplication.js';
import { isAuthorised } from '../middlewares/isAuthorized.js';

const Router = express.Router();

Router.get('/employer/getall', isAuthorised, employerGetAllJobApplications);
Router.get('/jobseeker/getall', isAuthorised, jobSeekerGetAllJobApplications);

Router.post('/jobseeker/post', isAuthorised , postApplication);
Router.delete('/jobseeker/delete/:id', isAuthorised ,jobSeekerDeleteApplication);




export default Router;