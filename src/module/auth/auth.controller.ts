import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


const register = catchAsync(async(req: Request, res: Response)=> {
    const result = await AuthService.register(req.body);

    sendResponse(res,{
        status: true,
        message: "User rgistered successfully",
        statusCode: StatusCodes.CREATED,
        data: {
            _id: result._id,
            name: result.name,
            email: result.email,
            role: result.role
        }
    })

    
})


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getAllUsers();

  sendResponse(res, {
    status: true,
    message: "Users fetched successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const login = catchAsync(async(req: Request, res: Response)=>{
    const result = await AuthService.login(req.body);
    // const tokenWithBearer = `Bearer ${result?.token}`;

      // Store token in an HTTP-only cookie
  res.cookie("token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

    sendResponse(res,{
        statusCode: StatusCodes.ACCEPTED,
        status: true,
        message: "User logged in successfully",
     
        data: 
        {token: result?.token}
    })
})

const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("token");
  
    sendResponse(res, {
      status: true,
      message: "User logged out successfully",
      statusCode: StatusCodes.OK,

      data: {}

    });
  });

export const AuthControllers = {
    register,
    getAllUsers,
    login,
    logout
}
