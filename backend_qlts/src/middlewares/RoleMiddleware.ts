import { Request, Response, NextFunction } from "express";
import { HttpStatus, Status } from "../constant/HttpStatus";
const checkRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: Status.ERROR,
        message: "Forbidden",
      });
    }
    next();
  };
};

export default checkRole;
