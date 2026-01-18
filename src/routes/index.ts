import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import postRoutes from "./post.routes";

const router = Router();

// Grouped Routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Nip API running " });
});

export default router;
