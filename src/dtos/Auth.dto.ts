export class SignUpDto {
  handle: string;
  contact: string;
  contactType: 'email' | 'sms';

  constructor(handle: string, contact: string, contactType: 'email' | 'sms') {
    this.handle = handle;
    this.contact = contact;
    this.contactType = contactType;
  }

  validate(): string | null {
    if (!this.handle?.trim()) return 'Handle is required';
    if (!this.contact?.trim()) return 'Contact is required';
    if (!['email', 'sms'].includes(this.contactType)) return 'Invalid contact type';
    return null;
  }
}

export class LoginDto {
  contact: string;
  otp: string;

  constructor(contact: string, otp: string) {
    this.contact = contact;
    this.otp = otp;
  }

  validate(): string | null {
    if (!this.contact?.trim()) return 'Contact is required';
    if (!this.otp || !/^\d{6}$/.test(this.otp)) return 'OTP must be 6 digits';
    return null;
  }
}