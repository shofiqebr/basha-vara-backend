import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "../user/user.validation";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const authRouter = Router();

// Register a new user
authRouter.post("/api/auth/register", validateRequest(UserValidation.userValidationSchema), AuthControllers.register);

// Get all users (Consider adding pagination or query filters)
authRouter.get("/api/auth/users", AuthControllers.getAllUsers);

// User login
authRouter.post("/api/auth/login", validateRequest(AuthValidation.loginValidationSchema), AuthControllers.login);

// User logout
authRouter.post("/api/auth/logout", AuthControllers.logout);

export default authRouter;
