import connectDB from "../config/connection";

async function migrate() {
  console.log("Starting MySQL database migration...\n");

  try {
    // Users table
    await connectDB.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        handle VARCHAR(100) UNIQUE NOT NULL,
        contact VARCHAR(255) UNIQUE NOT NULL,
        contactType ENUM('email', 'sms') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created");

    // Posts table
    await connectDB.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        authorHandle VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        hasNipNipHashtag BOOLEAN DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (authorHandle) REFERENCES users(handle) ON DELETE CASCADE
      )
    `);
    console.log("Posts table created");

    // Mentions table
    await connectDB.query(`
      CREATE TABLE IF NOT EXISTS mentions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        postId INT NOT NULL,
        mentionedHandle VARCHAR(100) NOT NULL,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (mentionedHandle) REFERENCES users(handle) ON DELETE CASCADE
      )
    `);
    console.log("Mentions table created");

    // Follows table
    await connectDB.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id INT AUTO_INCREMENT PRIMARY KEY,
        followerHandle VARCHAR(100) NOT NULL,
        followeeHandle VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_follow (followerHandle, followeeHandle),
        FOREIGN KEY (followerHandle) REFERENCES users(handle) ON DELETE CASCADE,
        FOREIGN KEY (followeeHandle) REFERENCES users(handle) ON DELETE CASCADE
      )
    `);
    console.log("Follows table created");

    // OTPs table
    await connectDB.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("OTPs table created");

    // Indexes - Create indexes with error handling
    const indexes = [
      { name: 'idx_posts_author', sql: 'CREATE INDEX idx_posts_author ON posts(authorHandle)' },
      { name: 'idx_mentions_post', sql: 'CREATE INDEX idx_mentions_post ON mentions(postId)' },
      { name: 'idx_follows_follower', sql: 'CREATE INDEX idx_follows_follower ON follows(followerHandle)' },
      { name: 'idx_follows_followee', sql: 'CREATE INDEX idx_follows_followee ON follows(followeeHandle)' }
    ];

    for (const index of indexes) {
      try {
        await connectDB.query(index.sql);
        console.log(`Index ${index.name} created`);
      } catch (error: any) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`ℹIndex ${index.name} already exists`);
        } else {
          throw error;
        }
      }
    }

    console.log("\n Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await connectDB.end();
  }
}

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));