import connectDB from "../config/connection";
import { IPost } from "../interfaces/IPost";

export class PostRepository {
  // Create a new post
  async create(post: IPost): Promise<IPost> {
    const [result]: any = await connectDB.query(
      `
      INSERT INTO posts (authorHandle, content, hasNipNipHashtag, createdAt)
      VALUES (?, ?, ?, NOW())
      `,
      [post.authorHandle, post.content, post.hasNipNipHashtag ? 1 : 0]
    );

    const [rows]: any = await connectDB.query(
      `SELECT * FROM posts WHERE id = ?`,
      [result.insertId]
    );

    return rows[0];
  }

  // Add mentions to the mentions table
  async addMentions(postId: number, mentions: string[]): Promise<void> {
    if (!mentions.length) return;
    const values = mentions.map((handle) => [postId, handle]);
    await connectDB.query(`INSERT INTO mentions (postId, mentionedHandle) VALUES ?`, [values]);
  }

  // Get timeline
  async getTimeline(userHandle: string, following: string[]): Promise<IPost[]> {
    const placeholders = following.length ? following.map(() => "?").join(",") : "''";

    const [rows]: any = await connectDB.query(
      `
      SELECT DISTINCT p.*
      FROM posts p
      LEFT JOIN mentions m ON m.postId = p.id
      WHERE
        m.mentionedHandle = ?
        OR p.authorHandle IN (${placeholders})
        OR p.content LIKE '%#NipNip%'
      ORDER BY p.createdAt DESC
      `,
      [userHandle, ...following]
    );

    return rows;
  }

  // Get all posts (optional)
  async findAll(): Promise<IPost[]> {
    const [rows]: any = await connectDB.query(`SELECT * FROM posts ORDER BY createdAt DESC`);
    return rows;
  }
}
