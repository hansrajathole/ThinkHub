import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import transporter from '../services/email.service.js';
import generateOTP from '../utils/otpGenerator.js';
import config from '../config/config.js';
import otpEmailTemplate from '../utils/emailTemplates.js';

// Generate and send OTP
export const sendOTP = async (email) => {
  try {

    if (!email) {
      throw new Error('Email is required');
    }
   
    const otp = generateOTP();
    
    await OTP.deleteMany({ email });

    await OTP.create({ email, otp });

    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: 'Email Verification Code',
      html: otpEmailTemplate(otp)
    };
    
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully to:', email);
    return 

  } catch (error) {
    console.error('Error in sendOTP:', error);
    throw new Error('Error sending OTP' , error.message);
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find the OTP document
    const otpDoc = await OTP.findOne({ email, otp });
    
    if (!otpDoc){
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP or OTP expired' 
      });
    }
    
    // OTP is valid, update user's verification status
    const user = await User.findOneAndUpdate({ email }, { isVerified: true });
    // Delete the OTP document
    await OTP.deleteOne({ _id: otpDoc._id });
    const token = await user.generateToken()

    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully', 
      user,
      token 
    });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying OTP', 
      error: error.message 
    });
  }
};
