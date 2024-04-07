import mongoose from 'mongoose';

export default () => {
    mongoose.connect(process.env.MONGODB_URI, {
        dbname: 'Mern_Stack_job_seeking'
    })
    .then(() => {console.log('database connected')})
    .catch((e) => {console.log('Error', e)});        
}


