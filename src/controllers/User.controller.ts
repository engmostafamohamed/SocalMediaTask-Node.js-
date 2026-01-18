import { Request, Response } from "express";
import { UserService } from "../services/User.service";

export class UserController {
  constructor(private userService: UserService) {}

  async listUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    res.render("users", { users });
  }

  async follow(req: Request, res: Response) {
    const { follower, followee } = req.body;
    await this.userService.follow(follower, followee);
    res.redirect("/users");
  }

  async showProfile(req: Request, res: Response) {
    const handle = req.query.handle as string; // or from req.params
    if (!handle) {
      return res.status(400).send("User handle is required");
    }

    const user = await this.userService.getUserByHandle(handle);
    if (!user) {
      return res.status(404).render("error", { error: "User not found" });
    }

    res.render("user/profile", { user });
  }
}
