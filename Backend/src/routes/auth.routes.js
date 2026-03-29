import { Router } from "express";
import * as userMiddleware from "../middleware/user.middleware.js";
import * as authController from "../controllers/auth.controller.js";
import * as otpController from "../controllers/otp.controller.js";
import { protectRoute } from "../middleware/protected.js";
import passport from 'passport';
import rateLimit from "express-rate-limit";
const router = Router();

const loginLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 20,
    message : "Too many login attempts, try again later."
})

router.post("/signup",userMiddleware.singupValidator,authController.singupController);
router.post("/signin",userMiddleware.loginValidator ,loginLimiter ,authController.loginController);
router.post("/forget-password", userMiddleware.forgetPasswordValidator, authController.forgetPasswordController);
router.post("/verify-otp", otpController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);
router.post('/google-login', authController.googleLoginController);
router.post("/logout", protectRoute, authController.logoutController);
router.get("/me", protectRoute, authController.meController);

export default router;
