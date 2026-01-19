import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const userHandle = (req as any).session?.userHandle;
  
  if (!userHandle) {
    res.redirect('/auth/signup');
    return;
  }
  
  next();
};

// Alternative: export as function
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const userHandle = (req as any).session?.userHandle;
  
  if (!userHandle) {
    res.redirect('/auth/signup');
    return;
  }
  
  next();
}
