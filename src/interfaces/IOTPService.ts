export interface IOTPService {
  generateOTP(contact: string, type: "email" | "sms"): Promise<string>;
  verifyOTP(contact: string, code: string): Promise<boolean>;
}
