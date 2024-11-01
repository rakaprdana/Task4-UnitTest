import { NextFunction, Request, Response } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
