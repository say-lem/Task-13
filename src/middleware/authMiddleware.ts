import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IAuthPayload } from "../interfaces/userInterface";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export interface AuthRequest extends Request {
  user?: IAuthPayload;
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IAuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
