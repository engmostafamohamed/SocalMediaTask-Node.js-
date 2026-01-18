import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { UserService } from "../services/User.service";
import { OTPService } from "../services/OTP.service";

const router = Router();
const userService = new UserService();
const otpService = new OTPService();
const authController = new AuthController(userService, otpService);

// Render signup page
router.get("/signup", (req, res) => authController.renderSignup(req, res));

// Handle signup form (create user + send OTP)
router.post("/signup", (req, res) => authController.signup(req, res));

// Render OTP verification page
router.get("/verify", (req, res) => authController.renderVerifyOTP(req, res));

// Handle OTP verification (login)
router.post("/login", (req, res) => authController.verifyOTP(req, res));

// Logout user
router.get("/logout", (req, res) => authController.logout(req, res));

export default router;
