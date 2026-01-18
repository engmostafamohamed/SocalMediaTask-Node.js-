import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).userHandle) {
    return res.redirect("/auth/signup");
  }
  next();
}