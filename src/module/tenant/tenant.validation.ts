// validations/tenant.validation.ts
import { z } from "zod";

// RentalRequest Validation Schema
export const RentalRequestSchema = z.object({
  listingId: z.string().uuid("Listing ID must be a valid UUID"), // Listing ID must be a valid UUID
  tenantId: z.string().uuid("Tenant ID must be a valid UUID"), // Tenant ID must be a valid UUID
  status: z.enum(["pending", "approved", "rejected"], {
    errorMap: () => ({ message: "Status must be one of 'pending', 'approved', or 'rejected'" }),
  }),
  landlordPhoneNumber: z.string().optional(), // Optional phone number
  paymentStatus: z.enum(["paid", "pending"]).optional(), // Optional payment status
  additionalMessage: z.string().optional(), // Optional additional message
});

// TenantProfile Validation Schema
export const TenantProfileSchema = z.object({
  userId: z.string().uuid("User ID must be a valid UUID"), // User ID must be a valid UUID
  name: z.string().min(2, "Name must be at least 2 characters long"), // Name should be at least 2 characters
  email: z.string().email("Invalid email address"), // Email should be valid
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long"), // Phone number should be at least 10 characters
  address: z.string().min(5, "Address must be at least 5 characters long"), // Address should be at least 5 characters long
  rentalHistory: z.array(z.string().uuid()).optional(), // Rental history should be an array of valid UUIDs (optional)
});

// Main Tenant Validation Schema
export const TenantSchema = z.object({
  profile: TenantProfileSchema, // Validate the tenant profile using the TenantProfileSchema
  rentalRequests: z.array(RentalRequestSchema).optional(), // Optional array of rental requests
});

