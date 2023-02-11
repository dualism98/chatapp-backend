import { NextFunction, Request, Response } from "express";
import User from "../models/User";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers.authorization;
    const user = await User.findById(userId);
    if (user) {
        return next();
    }
    res.sendStatus(403);
}

export default authMiddleware;