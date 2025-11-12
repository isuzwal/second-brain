import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
// middleware for the user

const JWT=process.env.JWT;

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

function Usermiddleware(req: Request, res: Response, next: NextFunction) {

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        status: false,
        message: "No token provide !",
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: false, 
        message: "No token provided, please login!",
      });
    }
    if(!JWT){
      throw new Error("Not JWT ")
    }
    const decode = jwt.verify(token, JWT) as JwtPayload;
    if (decode) {
      req.userId = decode.id;
      next();
    } else {
      res.status(403).json({
        message: "You are not logged in",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Invalid token ,please login again !1",
    });
  }
}
export default Usermiddleware;
