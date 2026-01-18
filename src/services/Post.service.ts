import connectDB from "../config/connection";
import { IPostService } from "../interfaces/IPostService";
import { IUser } from "../interfaces/IUser";
import { IPost } from "../interfaces/IPost";
import { NotificationService } from "./Notification.service";
import { Post } from "../models/Post.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class PostService implements IPostService {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async createPost(authorHandle: string, content: string): Promise<IPost> {
    try {
      const post = new Post("0", authorHandle, content);

      const [result] = await connectDB.query<ResultSetHeader>(
        "INSERT INTO posts (authorHandle, content, hasNipNipHashtag) VALUES (?, ?, ?)",
        [post.authorHandle, post.content, post.hasNipNipHashtag ? 1 : 0]
      );

      const postId = result.insertId;

      // Get created post
      const [rows] = await connectDB.query<RowDataPacket[]>(
        "SELECT id, authorHandle, content, hasNipNipHashtag, createdAt FROM posts WHERE id = ?",
        [postId]
      );

      const createdPost = rows[0] as IPost;

      // Save mentions
      for (const mentionedHandle of post.mentions) {
        await connectDB.query(
          "INSERT INTO mentions (postId, mentionedHandle) VALUES (?, ?)",
          [postId, mentionedHandle]
        );
        
        try {
          await this.notificationService.sendPushNotification(
            mentionedHandle,
            `@${authorHandle} mentioned you: "${content}"`
          );
        } catch (notifError) {
          console.log(`[NOTIFICATION] Failed to notify @${mentionedHandle}`);
        }
      }

      console.log(`[POST] @${authorHandle}: "${content}"`);
      return createdPost;
    } catch (err: any) {
      throw new Error("Failed to create post: " + err.message);
    }
  }

  async getTimeline(userHandle: string, user: IUser): Promise<IPost[]> {
    try {
      // Get all posts
      const [allPosts] = await connectDB.query<RowDataPacket[]>(
        "SELECT id, authorHandle, content, hasNipNipHashtag, createdAt FROM posts ORDER BY createdAt DESC"
      );

      // Get posts where user is mentioned
      const [mentionPosts] = await connectDB.query<RowDataPacket[]>(
        `SELECT p.id, p.authorHandle, p.content, p.hasNipNipHashtag, p.createdAt 
         FROM posts p 
         JOIN mentions m ON p.id = m.postId 
         WHERE m.mentionedHandle = ?`,
        [userHandle]
      );

      // Get following list
      const [followingRows] = await connectDB.query<RowDataPacket[]>(
        "SELECT followeeHandle FROM follows WHERE followerHandle = ?",
        [userHandle]
      );
      const followingList = followingRows.map(f => f.followeeHandle as string);

      // Filter posts from following
      const followingPosts = (allPosts as IPost[]).filter(p => 
        followingList.includes(p.authorHandle)
      );

      // Filter #NipNip posts
      const nipNipPosts = (allPosts as IPost[]).filter(p => p.hasNipNipHashtag);

      // Combine all posts
      const combined: IPost[] = [
        ...(mentionPosts as IPost[]),
        ...followingPosts,
        ...nipNipPosts
      ];

      // Remove duplicates by id
      const uniqueMap = new Map<string, IPost>();
      combined.forEach(post => {
        uniqueMap.set(post.id, post);
      });
      
      const unique = Array.from(uniqueMap.values());
      
      // Sort by createdAt
      return unique.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (err: any) {
      console.error("[TIMELINE ERROR]", err);
      throw new Error("Failed to fetch timeline: " + err.message);
    }
  }
}