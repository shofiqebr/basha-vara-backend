import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email format" }),
      
    password: z
      .string({ required_error: "Password is required" })
      .min(3, { message: "Password must be at least 3 characters long" }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
};
