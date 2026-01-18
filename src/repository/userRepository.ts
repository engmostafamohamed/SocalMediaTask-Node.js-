import connectDB from "../config/connection";
import { IUser } from "../interfaces/IUser";

export class UserRepository {
  // 🧩 Get all users (with filters & pagination)
  async findAll(
    filters: any = {},
    pagination: { page: number; per_page: number } = { page: 1, per_page: 10 }
  ): Promise<{ data: IUser[]; pagination: any }> {
    const where: string[] = ["1=1"];
    const params: any[] = [];

    if (filters.handle) {
      where.push("handle LIKE ?");
      params.push(`%${filters.handle}%`);
    }

    if (filters.contact) {
      where.push("contact LIKE ?");
      params.push(`%${filters.contact}%`);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const offset = (pagination.page - 1) * pagination.per_page;

    const [rows]: any = await connectDB.query(
      `
      SELECT id, handle, contact, contactType, createdAt
      FROM users
      ${whereClause}
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
      `,
      [...params, pagination.per_page, offset]
    );

    const [countRows]: any = await connectDB.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    const total = countRows[0]?.total || 0;

    return {
      data: rows as IUser[],
      pagination: {
        total,
        page: pagination.page,
        per_page: pagination.per_page,
        total_pages: Math.ceil(total / pagination.per_page),
      },
    };
  }

  // 🧩 Create a user
  async create(user: IUser): Promise<IUser> {
    const [result]: any = await connectDB.query(
      `
      INSERT INTO users (handle, contact, contactType, createdAt)
      VALUES (?, ?, ?, NOW())
      `,
      [user.handle, user.contact, user.contactType]
    );

    const [rows]: any = await connectDB.query(
      `SELECT * FROM users WHERE id = ?`,
      [result.insertId]
    );

    return rows[0];
  }

  // 🧩 Find user by handle
  async findByHandle(handle: string): Promise<IUser | null> {
    const [rows]: any = await connectDB.query(
      `SELECT * FROM users WHERE handle = ? LIMIT 1`,
      [handle]
    );
    return rows[0] || null;
  }

  // 🧩 Find user by contact
  async findByContact(contact: string): Promise<IUser | null> {
    const [rows]: any = await connectDB.query(
      `SELECT * FROM users WHERE contact = ? LIMIT 1`,
      [contact]
    );
    return rows[0] || null;
  }

  // 🧩 Follow another user
  async followUser(followerHandle: string, followeeHandle: string): Promise<void> {
    await connectDB.query(
      `
      INSERT IGNORE INTO follows (followerHandle, followeeHandle, createdAt)
      VALUES (?, ?, NOW())
      `,
      [followerHandle, followeeHandle]
    );
  }

  // 🧩 Get followers and following for a user
  async getRelationships(handle: string): Promise<{ followers: string[]; following: string[] }> {
    const [followers]: any = await connectDB.query(
      `SELECT followerHandle FROM follows WHERE followeeHandle = ?`,
      [handle]
    );

    const [following]: any = await connectDB.query(
      `SELECT followeeHandle FROM follows WHERE followerHandle = ?`,
      [handle]
    );

    return {
      followers: followers.map((f: any) => f.followerHandle),
      following: following.map((f: any) => f.followeeHandle),
    };
  }

  async getAllUsers(): Promise<IUser[]> {
    const [rows]: any = await connectDB.query(`SELECT * FROM users ORDER BY createdAt DESC`);
    return rows;
  }
}
