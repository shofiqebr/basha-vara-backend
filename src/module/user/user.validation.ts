import { z } from "zod";
import { USER_ROLE } from "./user.constrants";

const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),

    email: z.string().email({ message: "Invalid email format" }),

    role: z
      .enum(Object.values(USER_ROLE) as [string, ...string[]])
      .default("customer")
      .optional(),

    phone: z
      .string()
      // .regex(/^\d{3,15}$/, { message: "Phone number must be 3-15 digits" })
      .optional(),

    address: z.string().max(100, { message: "Address cannot exceed 100 characters" }).optional(),

    city: z.string().max(50, { message: "City cannot exceed 50 characters" }).optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email format" }),
  }),
});

export const UserValidation = {
  userValidationSchema,
  loginValidationSchema,
};
