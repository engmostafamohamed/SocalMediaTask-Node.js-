import { Router } from "express";
import { UserController } from "../controllers/User.controller";
import { UserService } from "../services/User.service";
import { authMiddleware } from "../middleware/Auth.middleware";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

// Routes
router.get("/profile", authMiddleware, (req, res) => 
  userController.showProfile(req, res)
);

router.get("/all", authMiddleware, (req, res) => 
  userController.listUsers(req, res)
);

router.post("/follow", authMiddleware, (req, res) => 
  userController.follow(req, res)
);

export default router;
