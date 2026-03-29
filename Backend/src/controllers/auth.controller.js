import { validationResult } from "express-validator"
import * as userService from "../services/user.service.js"
import userModel from "../models/user.model.js"
import { sendOTP } from "./otp.controller.js"
import redis from "../services/redis.service.js"
import axios from "axios"

export const singupController = async (req,res)=>{
    
    const {username, email, password} = req.body

    try {

        const errors = validationResult(req)
    
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()[0].msg})
        }
        

        const user = await userService.createUser({
            username,
            email,
            password
        })
 

        delete user._doc.password

        res.status(200).json({ 
            success: true, 
            message: 'OTP sent successfully to your email' ,
            user
        });

    } catch (error) {
        console.log("Error in singupController : ", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export const loginController = async (req , res) => {
    const {username , email , password} = req.body
    try {
        console.log(req.body);
        
        const errors = validationResult(req)
    
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()[0].msg})
        }
        
        
        const user = await userService.loginUser({
            username,
            email,
            password,
           
        })

        delete user._doc.password
        
        const token = await user.generateToken()
        
        console.log("user logged in successfully");
        res.json({message: "User logged in successfully", token: token , user})


    } catch (error) {
        console.log("Error in loginController : ", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });   
    }
}


export const resendOTP = async (req, res) => {
    try {
      const { email } = req.body;
      
      
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Send OTP
      await sendOTP(email);

      res.status(200).json({
        success: true, 
        message: 'OTP resent successfully' 
      });
      
    } catch (error) {
      console.error('Error in resendOTP:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error resending OTP', 
        error: error.message 
      });
    }
  };

export const meController =  async (req, res)=>{
    try {
        const user = await userModel.findById(req.user._id)

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message : "User found successfully", user});

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const logoutController = async (req, res) => {
    if (!req.tokenData?.token || !req.tokenData?.exp) {
        return res.status(401).json({ message: "Invalid token" });
    }
    
    const timeRemainingForToken = req.tokenData.exp * 1000 - Date.now()

    if (timeRemainingForToken > 0) {
        await redis.set(`blacklist:${req.tokenData.token}`, "true", "EX", Math.floor(timeRemainingForToken / 1000))
    }

    res.status(200).json({message: "User logged out successfully"})
}

export const googleLoginController = async function(req,res){
    try{
        const { accessToken } = req.body;
        const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
        console.log(googleResponse.data);
        const {email,name,picture} = googleResponse.data;

        let user = await userModel.findOne({email});

        if(!user){
            user = await userModel.create({
                username: name,
                email,
                isVerified: true,
                avatar: picture
            })
        }

        const token = await user.generateToken();
        console.log(token ,'kua bai');
        
        res.status(200).json({
            user,
            token,
            message: "User login successfully"
        })

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


export const forgetPasswordController = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: errors.array()[0].msg 
            });
        }
        const { email , password , confirmPassword } = req.body;
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Emaii is invalid' 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password and confirm password do not match' 
            });
        }

        const hashedPassword = await userModel.hashedPassword(password);

        // Send OTP
        await userModel.findOneAndUpdate(
            { email },
            { password: hashedPassword },
        );

        await sendOTP(email);
        res.status(200).json({ 
            success: true, 
            message: 'OTP sent successfully to your email' 
        });

    } catch (error) {
        console.error('Error in forgetPasswordController:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing request', 
            error: error.message 
        });
    }           
}

