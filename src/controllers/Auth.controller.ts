import { Request, Response } from "express";
import { UserService } from "../services/User.service";
import { OTPService } from "../services/OTP.service";

// Extend the session type
declare module "express-session" {
  interface SessionData {
    userHandle: string;
  }
}

export class AuthController {
  constructor(
    private userService: UserService,
    private otpService: OTPService
  ) {}

  renderSignup(req: Request, res: Response) {
    res.render("auth/signup", { error: null });
  }

  async signup(req: Request, res: Response) {
    try {
      const { handle, contact, contactType } = req.body;
      
      await this.userService.createUser(handle, contact, contactType);
      const otpCode = await this.otpService.generateOTP(contact, contactType);

      res.render("auth/verify-otp", { 
        handle, 
        contact,
        otpCode,
        error: null 
      });
    } catch (error: any) {
      res.render("auth/signup", { error: error.message });
    }
  }

  renderVerifyOTP(req: Request, res: Response) {
    const { handle, contact } = req.query;
    res.render("auth/verify-otp", { 
      handle, 
      contact,
      otpCode: null,
      error: null 
    });
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { handle, code } = req.body;
      
      console.log(`[VERIFY] Attempting to verify OTP for handle: ${handle}, code: ${code}`);
      
      const user = await this.userService.getUserByHandle(handle);
      
      if (!user) {
        console.log(`[VERIFY] User not found: ${handle}`);
        return res.render("auth/verify-otp", { 
          handle, 
          contact: req.body.contact || '',
          otpCode: null,
          error: "User not found" 
        });
      }

      console.log(`[VERIFY] User found: ${user.handle}, verifying OTP for contact: ${user.contact}`);
      
      const isValid = await this.otpService.verifyOTP(user.contact, code);
      
      if (!isValid) {
        console.log(`[VERIFY] OTP verification failed`);
        return res.render("auth/verify-otp", { 
          handle,
          contact: user.contact,
          otpCode: null,
          error: "Invalid or expired OTP" 
        });
      }

      console.log(`[VERIFY] OTP verified successfully, setting session`);
      
      // Set session
      req.session.userHandle = handle;
      console.log(`[VERIFY] Session set for: ${handle}`);
      
      return res.redirect("/post/timeline");
      
    } catch (error: any) {
      console.error(`[VERIFY ERROR]`, error);
      res.render("auth/verify-otp", { 
        handle: req.body.handle,
        contact: req.body.contact || '',
        otpCode: null,
        error: error.message 
      });
    }
  }

  logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
      }
      res.redirect("/auth/signup");
    });
  }
}