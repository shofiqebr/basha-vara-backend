import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "../user/user.validation";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const authRouter = Router()

authRouter.post("/api/auth/register",validateRequest(UserValidation.userValidationSchema),AuthControllers.register)
authRouter.get('/api/auth/getAllUsers', AuthControllers.getAllUsers);
authRouter.post('/api/auth/login', validateRequest(AuthValidation.loginValidationSchema), AuthControllers.login);
authRouter.post('/api/auth/logout', AuthControllers.logout);
export default authRouter;