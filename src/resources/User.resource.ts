import { IUser } from '../interfaces/IUser';

export class UserResource {
  id: string;
  handle: string;
  contactType: 'email' | 'sms';
  followingCount: number;
  followersCount: number;
  createdAt: string;

  constructor(user: IUser) {
    this.id = user.id;
    this.handle = user.handle;
    this.contactType = user.contactType;
    this.followingCount = user.following.length;
    this.followersCount = user.followers.length;
    this.createdAt = user.createdAt.toISOString();
  }

  static toResource(user: IUser): UserResource {
    return new UserResource(user);
  }

  static toCollection(users: IUser[]): UserResource[] {
    return users.map(user => new UserResource(user));
  }
}