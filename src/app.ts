import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import routes from "./routes/index";
import i18nMiddleware from "./config/i18n";

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "nip-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Views & Static Files
// Update these paths based on your actual structure
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

// i18n
app.use(i18nMiddleware as any);

// Logger (dev only)
if (!isProduction) app.use(morgan("dev"));

// Routes
app.use("/", routes);

// Default home redirect
app.get("/", (req, res) => res.redirect("/auth/signup"));

export default app;