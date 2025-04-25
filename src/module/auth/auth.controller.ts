import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const register = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);

    sendResponse(res, {
        status: true,
        message: "User registered successfully",
        statusCode: StatusCodes.CREATED,
        data: {
            _id: result._id,
            name: result.name,
            email: result.email,
            role: result.role,
        }
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.getAllUsers();

    sendResponse(res, {
        status: true,
        message: "Users fetched successfully",
        statusCode: StatusCodes.OK,
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;
  
    const result = await AuthService.updateUser(id, updatedData);
  
    sendResponse(res, {
      status: true,
      message: "User updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  });

  const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AuthService.deleteUser(id);
  
    sendResponse(res, {
      status: true,
      message: "User deleted successfully",
      statusCode: 200,
      data: result,
    });
  });
  
  

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    sendResponse(res, {
        statusCode: StatusCodes.ACCEPTED,
        status: true,
        message: "User logged in successfully",
        data: {
            token: result.token,
            _id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            username: result.user.name,  // Include username
            role: result.user.role,
        }
    });
});


const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("token");

    sendResponse(res, {
        status: true,
        message: "User logged out successfully",
        statusCode: StatusCodes.OK,
        data: {},
    });
});

export const AuthControllers = {
    register,
    getAllUsers,
    updateUser,
    deleteUser,
    login,
    logout,
};
