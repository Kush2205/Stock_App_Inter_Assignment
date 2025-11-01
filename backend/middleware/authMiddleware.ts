import { Request , Response , NextFunction } from "express"
//@ts-ignore
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET || "secret", (err : any, decoded : any) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.body.userId = decoded.userId;
        next();
    });
}