import { Router } from "express";
import { UserController } from "../controllers/User.controller";
import { UserService } from "../services/User.service";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

// Routes
router.get("/profile", (req, res) => userController.showProfile(req, res)); // Now exists
router.post("/follow", (req, res) => userController.follow(req, res));

export default router;
