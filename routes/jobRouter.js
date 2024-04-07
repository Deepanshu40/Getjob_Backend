import express from 'express';
import {deleteJob, getAllJobs, getMyJob, postJob, updateJob, getSingleJob} from '../controller/jobController.js';
import { isAuthorised } from '../middlewares/isAuthorized.js';

const Router = express.Router();

Router.get('/getall', getAllJobs);

Router.post('/post', isAuthorised, postJob);

Router.get('/getmyjob', isAuthorised, getMyJob);


Router.put('/updatejob/:id', isAuthorised, updateJob);

Router.delete('/deletejob/:id', isAuthorised, deleteJob);

Router.get("/:id", getSingleJob);

export default Router;