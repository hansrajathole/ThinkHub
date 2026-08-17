import userModel from "../models/user.model.js"
import { sendOTP } from "../controllers/otp.controller.js";
export const createUser = async function ({ username, email, password  }) {
  
        if(!username || !email || !password) {
            throw new Error("All fields are required");
        }


        const alreadyExist  = await userModel.findOne({
            $or: [{ username }, { email }]
        });
        console.log(alreadyExist);
        
        if(alreadyExist){
            throw new Error("username or email already exist");
        }
        
        const hashedPassword = await userModel.hashedPassword(password);
        

        const newUser = new userModel({
            username,
            email,
            password : hashedPassword,
            isVerified: false
        });

        await newUser.save();

        // Send OTP for email verification
        await sendOTP(email);

        
        return newUser

}


export const loginUser = async function ({username , email , password}) {
    
    if(!email && !username) {
        throw new Error("Username or Password required")
    }

    if(!password){
        throw new Error("Password is required")
    }

    const user = await userModel.findOne({
        $or: [{ username }, { email }]
    }).select("+password").populate("questions")
    console.log(user);
    
    if(!user){
        throw new Error("username or password is incorrect")
    }

    if (!user.isVerified) {
        const err = new Error('Please verify your email before logging in');
        err.requireVerification = true;
        err.email = user.email;
        throw err;
      }

    const isMatch = await user.verifyPassword(password)
    
    if(!isMatch){
        throw new Error("username or password is incorrect")
    }

    delete user._doc.password

    return user
    
}