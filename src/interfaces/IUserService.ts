import { IUser } from "./IUser";

export interface IUserService {
  createUser(handle: string, contact: string, contactType: "email" | "sms"): Promise<IUser>;
  getUserByHandle(handle: string): Promise<IUser | null>;
  getUserByContact(contact: string): Promise<IUser | null>;
  follow(followerHandle: string, followeeHandle: string): Promise<void>;
  getAllUsers(): Promise<IUser[]>;
}
