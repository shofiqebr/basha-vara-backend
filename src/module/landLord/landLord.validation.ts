import { z } from "zod";

// Create a new rental listing
const createListingValidationSchema = z.object({
  body: z.object({
    location: z
      .string({ required_error: "Location is required" })
      .min(1, { message: "Location is required" }),
    description: z
      .string({ required_error: "Description is required" })
      .min(1, { message: "Description is required" }),
    rentAmount: z
      .number({ required_error: "Rent amount is required" })
      .min(0, { message: "Rent amount must be a positive number" }),
    numberOfBedrooms: z
      .number({ required_error: "Number of bedrooms is required" })
      .min(1, { message: "Number of bedrooms must be at least 1" }),
    images: z
      .array(z.string().url(), { required_error: "At least one image URL is required" })
      .min(1, { message: "At least one image is required" }),
  }),
});

// Update a rental listing
const updateListingValidationSchema = z.object({
  body: z.object({
    location: z.string().optional(),
    description: z.string().optional(),
    rentAmount: z.number().min(0).optional(),
    numberOfBedrooms: z.number().min(1).optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

// Respond to a rental request (approve/reject)
const respondToRequestValidationSchema = z.object({
  body: z.object({
    status: z.enum(["approved", "rejected"], {
      required_error: "Status is required",
    }),
    phoneNumber: z
      .string()
      .min(10, { message: "Phone number must be at least 6 characters long" })
      .optional(),
  }),
});

export const ListingValidation = {
  createListingValidationSchema,
  updateListingValidationSchema,
  respondToRequestValidationSchema,
};
