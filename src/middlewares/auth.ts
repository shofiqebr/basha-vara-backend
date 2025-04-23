/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import config from "../app/config";
import User from "../module/user/user.model";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
    email: string;
  };
}


const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }
    // console.log("JWT Secret:", config.jwt.access_secret);
    // console.log("Decoded token:", jwt.decode(token));
    // console.log("Received Token:", req.headers.authorization);



    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt.access_secret
    ) as JwtPayload;
  

    const { role, email,
        //  iat
         } = decoded;
   

    // checking if the user is exist
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "This user is not found !");
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to access this resource!");
    }

    req.user = {
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    next();
  });
};

export default auth;
