import connectDB from "../config/connection";
import { IOTP } from "../interfaces/IOTP";

export class OTPRepository {
  async save(contact: string, code: string, expiresAt: Date): Promise<void> {
    await connectDB.query(
      `
      INSERT INTO otps (contact, code, expiresAt, createdAt)
      VALUES (?, ?, ?, NOW())
      `,
      [contact, code, expiresAt]
    );
  }

  async verify(contact: string, code: string): Promise<boolean> {
    const [rows]: any = await connectDB.query(
      `
      SELECT * FROM otps
      WHERE contact = ? AND code = ? AND expiresAt > NOW()
      ORDER BY createdAt DESC
      LIMIT 1
      `,
      [contact, code]
    );
    return rows.length > 0;
  }

  async deleteExpired(): Promise<void> {
    await connectDB.query(`DELETE FROM otps WHERE expiresAt < NOW()`);
  }
}
