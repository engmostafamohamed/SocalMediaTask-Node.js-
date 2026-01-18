import { Request, Response } from "express";
import { PostService } from "../services/Post.service";
import { UserService } from "../services/User.service";
import connectDB from "../config/connection";
import { RowDataPacket } from "mysql2";

// Extend session type
declare module "express-session" {
  interface SessionData {
    userHandle: string;
  }
}

export class PostController {
  constructor(
    private postService: PostService,
    private userService: UserService
  ) {}

  async showTimeline(req: Request, res: Response) {
    try {
      const userHandle = (req.session as any).userHandle;
      if (!userHandle) {
        return res.redirect("/auth/signup");
      }

      // Get current user
      const user = await this.userService.getUserByHandle(userHandle);

      if (!user) {
        return res.redirect("/auth/signup");
      }
      // Get timeline posts
      const timeline = await this.postService.getTimeline(userHandle, user);

      // Get all users
      const allUsers = await this.userService.getAllUsers();
      const otherUsers = allUsers.filter(u => u.handle !== userHandle);

      // Get following list
      const [followingRows] = await connectDB.query<RowDataPacket[]>(
        "SELECT followeeHandle FROM follows WHERE followerHandle = ?",
        [userHandle]
      );
      const following = followingRows.map(f => f.followeeHandle as string);

      // Get counts
      const [followingCountRows] = await connectDB.query<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM follows WHERE followerHandle = ?",
        [userHandle]
      );
      const [followersCountRows] = await connectDB.query<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM follows WHERE followeeHandle = ?",
        [userHandle]
      );

      res.render("post/timeline", {
        user: {
          ...user,
          following,
          followingCount: followingCountRows[0].count,
          followersCount: followersCountRows[0].count
        },
        timeline,
        allUsers: otherUsers,
        currentLang: req.cookies.language || 'en'
      });
    } catch (error: any) {
      console.error("[TIMELINE ERROR]", error);
      res.status(500).send("Error loading timeline: " + error.message);
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const userHandle = (req.session as any).userHandle;

      if (!userHandle) {
        return res.redirect("/auth/signup");
      }

      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        return res.redirect("/post/timeline");
      }

      await this.postService.createPost(userHandle, content);
      res.redirect("/post/timeline");
    } catch (error: any) {
      console.error("[CREATE POST ERROR]", error);
      res.status(500).send("Error creating post: " + error.message);
    }
  }
}