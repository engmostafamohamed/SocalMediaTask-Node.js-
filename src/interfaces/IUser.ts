export interface IUser {
  id: string;
  handle: string;
  contact: string;
  contactType: 'email' | 'sms';
  following: string[];
  followers: string[];
  createdAt: Date;
}