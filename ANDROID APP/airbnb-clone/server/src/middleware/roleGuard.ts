import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const roleGuard = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Role '${req.user.role}' is not authorized to access this route.`, 403));
    }

    next();
  };
};
