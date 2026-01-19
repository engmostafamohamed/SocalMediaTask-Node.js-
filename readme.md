Nip - Microblogging Platform
A modern, multilingual microblogging platform built with Node.js, Express, TypeScript, and MySQL. Features include user authentication with OTP, post creation with mentions and hashtags, following system, and real-time timelines.
✨ Features

🔐 Secure Authentication: OTP-based login via email or SMS
📝 Post Creation: Create posts up to 280 characters
👥 Mentions: Tag other users with @username
🔥 Hashtags: Use #NipNip to make posts visible to all users
🤝 Follow System: Follow users to see their posts in your timeline
🌍 Multilingual: Supports English and Arabic
📱 Responsive Design: Works on desktop and mobile devices

🛠️ Tech Stack

Backend: Node.js, Express.js, TypeScript
Database: MySQL
Template Engine: EJS
Session Management: express-session
Internationalization: i18n
Authentication: OTP (One-Time Password)

📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v16 or higher)
npm (comes with Node.js)
MySQL (v8.0 or higher)
Git

🚀 Installation
1. Clone the Repository
bashgit clone https://github.com/yourusername/nip-microblogging.git
cd nip-microblogging
2. Install Dependencies
bashnpm install
3. Database Setup
Create MySQL Database
Open MySQL command line or MySQL Workbench and run:
sqlCREATE DATABASE nip_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
Or use the MySQL command line:
bashmysql -u root -p
Then execute:
sqlCREATE DATABASE nip_db;
EXIT;
4. Environment Configuration
Create a .env file in the root directory:
bashtouch .env
Or on Windows:
bashtype nul > .env
Add the following configuration to .env:
env# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nip_db
DB_PORT=3306

# Server Configuration
PORT=3030
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
Important: Replace your_mysql_password with your actual MySQL password and SESSION_SECRET with a strong random string.
5. Run Database Migration
Run the migration script to create all necessary tables:
bashnpm run migrate
You should see output like:
Starting MySQL database migration...

✅ Users table created
✅ Posts table created
✅ Mentions table created
✅ Follows table created
✅ OTPs table created
✅ Index idx_posts_author created
✅ Index idx_mentions_post created
✅ Index idx_follows_follower created
✅ Index idx_follows_followee created

✅ Migration completed successfully!
🏃 Running the Application
Development Mode
Start the development server with auto-reload:
bashnpm run dev
The application will be available at:
http://localhost:3030
Production Mode

Build the TypeScript code:

bashnpm run build

Start the production server:

bashnpm start
📁 Project Structure
nip-microblogging/
├── src/
│   ├── config/
│   │   ├── connection.ts          # Database connection
│   │   └── i18n.ts                # Internationalization config
│   ├── controllers/
│   │   ├── Auth.controller.ts     # Authentication logic
│   │   ├── Post.controller.ts     # Post management
│   │   └── User.controller.ts     # User management
│   ├── database/
│   │   └── migrate.ts             # Database migration script
│   ├── interfaces/
│   │   ├── IUser.ts               # User interface
│   │   ├── IPost.ts               # Post interface
│   │   ├── IOTP.ts                # OTP interface
│   │   └── ...
│   ├── middleware/
│   │   └── Auth.middleware.ts     # Authentication middleware
│   ├── models/
│   │   ├── User.model.ts          # User model
│   │   ├── Post.model.ts          # Post model
│   │   └── OTP.model.ts           # OTP model
│   ├── routes/
│   │   ├── auth.routes.ts         # Authentication routes
│   │   ├── post.routes.ts         # Post routes
│   │   ├── user.routes.ts         # User routes
│   │   └── index.ts               # Routes aggregator
│   ├── services/
│   │   ├── User.service.ts        # User business logic
│   │   ├── Post.service.ts        # Post business logic
│   │   ├── OTP.service.ts         # OTP business logic
│   │   └── Notification.service.ts
│   ├── locales/
│   │   ├── en.json                # English translations
│   │   └── ar.json                # Arabic translations
│   ├── types/
│   │   └── express/
│   │       └── index.d.ts         # TypeScript type definitions
│   ├── app.ts                     # Express app configuration
│   └── server.ts                  # Server entry point
├── frontend/
│   ├── views/
│   │   ├── auth/
│   │   │   ├── signup.ejs         # Signup page
│   │   │   └── verify-otp.ejs     # OTP verification page
│   │   ├── post/
│   │   │   └── timeline.ejs       # Timeline page
│   │   └── partials/
│   │       ├── header.ejs         # Header component
│   │       └── footer.ejs         # Footer component
│   └── public/
│       ├── css/
│       │   └── style.css          # Styles
│       └── js/
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
├── package.json                   # NPM dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
🗄️ Database Schema
Users Table
sqlCREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  handle VARCHAR(100) UNIQUE NOT NULL,
  contact VARCHAR(255) UNIQUE NOT NULL,
  contactType ENUM('email', 'sms') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Posts Table
sqlCREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  authorHandle VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  hasNipNipHashtag BOOLEAN DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (authorHandle) REFERENCES users(handle) ON DELETE CASCADE
);
Mentions Table
sqlCREATE TABLE mentions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postId INT NOT NULL,
  mentionedHandle VARCHAR(100) NOT NULL,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (mentionedHandle) REFERENCES users(handle) ON DELETE CASCADE
);
Follows Table
sqlCREATE TABLE follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  followerHandle VARCHAR(100) NOT NULL,
  followeeHandle VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_follow (followerHandle, followeeHandle),
  FOREIGN KEY (followerHandle) REFERENCES users(handle) ON DELETE CASCADE,
  FOREIGN KEY (followeeHandle) REFERENCES users(handle) ON DELETE CASCADE
);
OTPs Table
sqlCREATE TABLE otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
📝 Available Scripts
json{
  "dev": "nodemon --watch \"src/**/*.ts\" --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "migrate": "ts-node src/database/migrate.ts"
}

npm run dev - Start development server with hot reload
npm run build - Compile TypeScript to JavaScript
npm start - Start production server
npm run migrate - Run database migrations

🔑 How to Use
1. Sign Up

Navigate to http://localhost:3030
You'll be redirected to the signup page
Enter your username, email/phone, and select contact type
Click "Request OTP"

2. Verify OTP

A 6-digit OTP will be displayed in a popup
The OTP is also logged to the console
Enter the OTP and click "Verify & Login"
Note: OTP expires in 5 minutes

3. Create Posts

After login, you'll see your timeline
Use the post composer at the top
Mention users with @username
Use #NipNip to make your post visible to everyone

4. Follow Users

Check the sidebar for "All Users"
Click "Follow" to follow a user
Their posts will appear in your timeline

5. Timeline Rules
Your timeline shows:

Posts from users you follow
Posts where you're mentioned (@yourhandle)
All posts with #NipNip hashtag

🌐 Internationalization
The app supports multiple languages. Switch languages using the language selector in the header.
Currently supported languages:

English (en)
Arabic (ar)

🔒 Security Features

Session-based authentication
HTTP-only cookies
OTP expiration (5 minutes)
SQL injection prevention (parameterized queries)
Password-free authentication
CSRF protection ready

🐛 Troubleshooting
Port Already in Use
If port 3030 is already in use, change it in .env:
envPORT=3000
Database Connection Error

Check if MySQL is running:

bash   # Windows
   net start MySQL80
   
   # macOS/Linux
   sudo service mysql start

Verify credentials in .env
Ensure database exists:

sql   SHOW DATABASES;
Migration Errors
If migration fails, drop all tables and run again:
bashnpm run migrate
Session Not Working

Clear browser cookies
Check SESSION_SECRET is set in .env
Restart the server

TypeScript Errors
Clear compiled files and reinstall:
bashrm -rf node_modules dist
npm install
npm run dev
🤝 Contributing

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📄 License
This project is licensed under the MIT License.
👨‍💻 Author
Your Name - @yourhandle
Project Link: https://github.com/yourusername/nip-microblogging
🙏 Acknowledgments

Express.js team for the excellent framework
MySQL for the robust database
EJS for templating
All contributors who helped make this project better


Made with ❤️ using TypeScript and Node.js