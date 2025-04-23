import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),

    email: z.string().email({ message: "Invalid email format" }),

    password: z
      .string()
      .min(3, { message: "Password must be at least 3 characters long" }),

    role: z.enum(["admin", "landlord", "tenant"]).default("tenant").optional(),

    phone: z
      .string().optional(),

    address: z.string().max(100, { message: "Address cannot exceed 100 characters" }).optional(),

    city: z.string().max(50, { message: "City cannot exceed 50 characters" }).optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(3, { message: "Password is required" }),
  }),
});

export const UserValidation = {
  userValidationSchema,
  loginValidationSchema,
};
