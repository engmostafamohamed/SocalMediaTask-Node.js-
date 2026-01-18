import { IOTP } from '../interfaces/IOTP';

export class OTP implements IOTP {
  code: string;
  contact: string;
  expiresAt: Date;

  constructor(code: string, contact: string, expiryMinutes: number = 5) {
    this.code = code;
    this.contact = contact;
    this.expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(code: string): boolean {
    return !this.isExpired() && this.code === code;
  }
}