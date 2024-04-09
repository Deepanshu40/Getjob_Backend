import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import jobRouter from './routes/jobRouter.js';
import dbConnection from './database/dbConnection.js';
import {errorHandler} from './middlewares/error.js'


const app = express();
dotenv.config({path:'./config/config.env'});


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Origin']
}))

app.options('*', cors());

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use((req, res) => {
console.log('axios request is going through server');
res.send('axios request is going through server');
})

app.use('/api/v1/user', userRouter);
app.use('/api/v1/application', applicationRouter);
app.use('/api/v1/job', jobRouter);

dbConnection();


app.use(errorHandler);
export default app;


