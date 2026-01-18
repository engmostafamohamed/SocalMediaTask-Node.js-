import connectDB from "../config/connection";
import { IOTPService } from "../interfaces/IOTPService";
import { OTP } from "../models/OTP.model";
import { RowDataPacket } from "mysql2";

export class OTPService implements IOTPService {
  async generateOTP(contact: string, type: "email" | "sms"): Promise<string> {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const otp = new OTP(code, contact, 5); // 5 minutes expiry

      await connectDB.query(
        "INSERT INTO otps (contact, code, expiresAt) VALUES (?, ?, ?)",
        [otp.contact, otp.code, otp.expiresAt]
      );

      console.log(`[${type.toUpperCase()}] Sent OTP ${code} to ${contact}`);
      return code;
    } catch (err: any) {
      throw new Error("Failed to generate OTP: " + err.message);
    }
  }

  async verifyOTP(contact: string, code: string): Promise<boolean> {
    try {
      const [rows] = await connectDB.query<RowDataPacket[]>(
        "SELECT id, code, expiresAt FROM otps WHERE contact = ? AND code = ? ORDER BY id DESC LIMIT 1",
        [contact, code]
      );

      if (rows.length === 0) return false;

      const otpRow = rows[0];
      
      // Create OTP instance with data from database
      const otp = new OTP(otpRow.code, contact);
      otp.expiresAt = new Date(otpRow.expiresAt);
      
      return otp.isValid(code);
    } catch (err: any) {
      throw new Error("Failed to verify OTP: " + err.message);
    }
  }
}