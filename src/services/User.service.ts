import { config } from './../../node_modules/effect/src/internal/defaultServices';
import connectDB from "../config/connection";
import { IUser } from "../interfaces/IUser";
import { IUserService } from "../interfaces/IUserService";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class UserService implements IUserService {
  async createUser(handle: string, contact: string, contactType: "email" | "sms"): Promise<IUser> {
    try {
      const existing = await this.getUserByHandle(handle);
      if (existing) throw new Error(`User @${handle} already exists`);

      await connectDB.query(
        "INSERT INTO users (handle, contact, contactType) VALUES (?, ?, ?)",
        [handle, contact, contactType]
      );

      const user = await this.getUserByHandle(handle);
      if (!user) throw new Error("Failed to create user");
      console.log(`[USER] Created @${handle} with ${contactType}: ${contact}`);
      return user;
    } catch (err: any) {
      throw new Error("User creation failed: " + err.message);
    }
  }

  async getUserByHandle(handle: string): Promise<IUser | null> {
    try {
      const [rows] = await connectDB.query<RowDataPacket[]>(
        "SELECT id, handle, contact, contactType, createdAt FROM users WHERE handle = ?",
        [handle]
      );
      return rows.length > 0 ? (rows[0] as IUser) : null;
    } catch (err: any) {
      throw new Error("Failed to fetch user by handle: " + err.message);
    }
  }

  async getUserByContact(contact: string): Promise<IUser | null> {
    try {
      const [rows] = await connectDB.query<RowDataPacket[]>(
        "SELECT id, handle, contact, contactType, createdAt FROM users WHERE contact = ?",
        [contact]
      );
      return rows.length > 0 ? (rows[0] as IUser) : null;
    } catch (err: any) {
      throw new Error("Failed to fetch user by contact: " + err.message);
    }
  }

  async follow(followerHandle: string, followeeHandle: string): Promise<void> {
    try {
      if (followerHandle === followeeHandle)
        throw new Error("Cannot follow yourself");

      await connectDB.query(
        "INSERT IGNORE INTO follows (followerHandle, followeeHandle) VALUES (?, ?)",
        [followerHandle, followeeHandle]
      );
      console.log(`[FOLLOW] @${followerHandle} now follows @${followeeHandle}`);
    } catch (err: any) {
      throw new Error("Follow action failed: " + err.message);
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const [rows] = await connectDB.query<RowDataPacket[]>(
        "SELECT id, handle, contact, contactType, createdAt FROM users"
      );
      return rows as IUser[];
    } catch (err: any) {
      throw new Error("Failed to get users: " + err.message);
    }
  }
}