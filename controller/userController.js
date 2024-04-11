import wrapAsync from "../middlewares/wrapAsync.js";
import ErrorHandler from "../middlewares/error.js";
import User from '../models/userSchema.js';
import {sendToken} from '../utility/jwtToken.js';

export const register = wrapAsync( async (req, res, next) => {
    const {name, email, phone, role, password} = req.body;
    if (!name || !email || !phone || !role || !password) {
        return next(new ErrorHandler('Please enter complete user details'))
    }

    const isEmail = await User.findOne({email})
    
    if (isEmail) {
        return next(new ErrorHandler('email already registered'));
    }
 
    console.log('reached');
    let user = new User({name, email, phone, role, password})
        
    await user.save();
        res.status(200).json({
        success: true,
        message: 'User registered',
        user,
    });
    sendToken(user, 200, res, 'User registered successfully');
});

export const login = wrapAsync(async (req, res, next) => {
    const {email, password, role} = req.body;

    if (!email || !password || !role) {
      return next(new ErrorHandler("Please provide email, password and role", 400));
    };

    const user = await User.findOne({email}).select('+password');
    
    
    if (!user) {
       return next(new ErrorHandler('Invalid email or Password'));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
       return next(new ErrorHandler('Invalid email or password', 400));
    }
    if (user.role !== role) {
        return next(new ErrorHandler('User with this role not found', 400));
    }
    sendToken(user, 200, res, 'user logged in successfully'); 

    next();
});

export const logout = wrapAsync(async (req, res, next) => {
    res.status(201).cookie('token', '', {
        httOnly: true,
        sameSite: 'None', 
        secure: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: 'user logged out successfully!',
    });
});


export const getUser = wrapAsync(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    })
});
