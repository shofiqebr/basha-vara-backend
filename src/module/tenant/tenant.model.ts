import mongoose, { Document, Schema } from "mongoose";
import { RentalRequest, TenantProfile } from "./tenant.interface";
// import { TenantProfile, RentalRequest } from "../interfaces/tenant.interface"; // Uncomment and use these interfaces

// Rental Request Schema
const RentalRequestSchema: Schema = new Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Listing model
      ref: "Listing",
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Tenant (User) model
      ref: "User",
      required: true,
    },
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    landlordPhoneNumber: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
    },
    additionalMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

// Tenant Profile Schema
const TenantProfileSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model (Tenant)
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rentalHistory: {
      type: [String], // Array of listing IDs or references
      default: [],
    },
  },
  { timestamps: true }
);

// Main Tenant Schema that combines rental requests and profile
const TenantSchema: Schema = new Schema(
  {
    profile: {
      type: TenantProfileSchema,
      required: true,
    },
    rentalRequests: {
      type: [RentalRequestSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Create and export the model
const TenantModel = mongoose.model<TenantProfile & { rentalRequests: RentalRequest[] } & Document>("Tenant", TenantSchema);

export default TenantModel;
