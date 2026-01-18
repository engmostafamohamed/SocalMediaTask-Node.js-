import { Router } from "express";
import { PostController } from "../controllers/Post.controller";
import { PostService } from "../services/Post.service";
import { UserService } from "../services/User.service";
import { NotificationService } from "../services/Notification.service";
import { requireAuth } from "../middleware/Auth.middleware";

const router = Router();

const notificationService = new NotificationService();
const postService = new PostService(notificationService);
const userService = new UserService();
const postController = new PostController(postService, userService);

// Apply auth middleware to all routes
router.use(requireAuth);

router.get("/timeline", (req, res) => postController.showTimeline(req, res));
router.post("/create", (req, res) => postController.createPost(req, res));

export default router;