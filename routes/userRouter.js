import express from 'express';
import {register, login, logout, getUser} from '../controller/userController.js';
import { isAuthorised } from '../middlewares/isAuthorized.js';

const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login);

Router.get('/logout', isAuthorised, logout);
Router.get('/getuser', isAuthorised, getUser);


export default Router;