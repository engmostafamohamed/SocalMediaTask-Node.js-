import { Request, Response } from "express";
import { UserService } from "../services/User.service";

export class UserController {
  constructor(private userService: UserService) {}

  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      const currentHandle = (req as any).session?.userHandle;
      
      res.render("users", { 
        users,
        currentLang: req.getLocale ? req.getLocale() : 'en',
        userHandle: currentHandle
      });
    } catch (error: any) {
      console.error('[ERROR]', error);
      res.status(500).render('error', { 
        error: error.message,
        currentLang: req.getLocale ? req.getLocale() : 'en',
        userHandle: (req as any).session?.userHandle || null
      });
    }
  }

  async follow(req: Request, res: Response): Promise<void> {
    try {
      // Get current user from session
      const followerHandle = (req as any).session?.userHandle;
      // Get user to follow from form data
      const followeeHandle = req.body.followHandle;

      console.log(`Follower: ${followerHandle}, Followee: ${followeeHandle}`);

      // Validate
      if (!followerHandle) {
        return res.status(401).redirect('/auth/signup');
      }

      if (!followeeHandle) {
        res.status(400).send('User to follow is required');
        return;
      }

      await this.userService.follow(followerHandle, followeeHandle);
      
      // Redirect back to timeline or previous page
      res.redirect('/post/timeline');
    } catch (error: any) {
      console.error('[ERROR]', error);
      res.status(500).render('error', { 
        error: error.message,
        currentLang: req.getLocale ? req.getLocale() : 'en',
        userHandle: (req as any).session?.userHandle || null
      });
    }
  }

  async showProfile(req: Request, res: Response): Promise<void> {
    try {
      const handle = (req.query.handle || req.params.handle) as string;
      
      if (!handle) {
        return res.status(400).render('error', { 
          error: 'User handle is required',
          currentLang: req.getLocale ? req.getLocale() : 'en',
          userHandle: (req as any).session?.userHandle || null
        });
      }

      const user = await this.userService.getUserByHandle(handle);
      
      if (!user) {
        return res.status(404).render('error', { 
          error: 'User not found',
          currentLang: req.getLocale ? req.getLocale() : 'en',
          userHandle: (req as any).session?.userHandle || null
        });
      }

      res.render('user/profile', { 
        user,
        currentLang: req.getLocale ? req.getLocale() : 'en',
        userHandle: (req as any).session?.userHandle || null
      });
    } catch (error: any) {
      console.error('[ERROR]', error);
      res.status(500).render('error', { 
        error: error.message,
        currentLang: req.getLocale ? req.getLocale() : 'en',
        userHandle: (req as any).session?.userHandle || null
      });
    }
  }
}