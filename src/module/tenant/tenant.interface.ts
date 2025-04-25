// interfaces/tenant.interface.ts

import mongoose from "mongoose";

export interface RentalRequest {
    _id?: string; // Optional ID for MongoDB document
    listingId: string; // ID of the rental house (listing)
    tenantId: string; // Tenant's ID (to identify the tenant submitting the request)
    landlordId: string;
    status: "pending" | "approved" | "rejected"; // Current status of the request
    landlordPhoneNumber?: string; // Landlord's phone number (provided upon approval)
    paymentStatus?: "paid" | "pending"; // Payment status (only applicable for approved requests)
    additionalMessage?: string; // Additional message or information provided by the tenant

    rentalRequests?: {
       _id: mongoose.Types.ObjectId;
          listingId: string;
          landlordId:string;
          status: "pending" | "approved" | "rejected";
          additionalMessage?: string;
          landlordPhoneNumber?: string;
          phoneNumber?: string;
          moveInDate?: string;
          rentalDuration?: string;
          specialRequirements?: string;
    }[]; // Track rental requests made by tenant,
    createdAt?: Date; // Date of request creation
    updatedAt?: Date; // Date of last update
  }
  
  export interface TenantProfile {
    _id?: string; // Optional, as MongoDB will auto-generate the ID
    userId: string; // Reference to the user (tenant)
    name: string; // Tenant's name
    email: string; // Tenant's email
    phoneNumber: string; // Tenant's phone number
    address: string; // Tenant's address
    rentalHistory: string[]; // Array of rental history (listing IDs or other references)
    createdAt?: Date; // Optional, the date the profile was created
    updatedAt?: Date; // Optional, the date the profile was last updated
  }
  
  export interface Tenant {
    profile: TenantProfile; // Profile of the tenant
    rentalRequests: RentalRequest[]; // Rental requests made by the tenant
  }

  export interface UpdateRentalRequestInput {
    tenantId: string;
    listingId: string;
    additionalMessage?: string;
    landlordPhoneNumber?: string;
    status?: "pending" | "approved" | "rejected";
    moveInDate?: string;
    rentalDuration?: string;
    specialRequirements?: string
  }
  
  