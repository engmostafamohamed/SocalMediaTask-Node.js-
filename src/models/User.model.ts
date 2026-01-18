import { IUser } from '../interfaces/IUser';

export class User implements IUser {
  id: string;
  handle: string;
  contact: string;
  contactType: 'email' | 'sms';
  following: string[];
  followers: string[];
  createdAt: Date;

  constructor(id: string, handle: string, contact: string, contactType: 'email' | 'sms') {
    this.id = id;
    this.handle = handle;
    this.contact = contact;
    this.contactType = contactType;
    this.following = [];
    this.followers = [];
    this.createdAt = new Date();
  }

  addFollowing(handle: string): void {
    if (!this.following.includes(handle)) {
      this.following.push(handle);
    }
  }

  addFollower(handle: string): void {
    if (!this.followers.includes(handle)) {
      this.followers.push(handle);
    }
  }
}