/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */

import { BadRequestError, NotFoundError } from "../../errors/errors";
import User from "../user/user.model";
// import { Tenant } from "./tenant.interface";
// import TenantModel from "./tenant.model";




// Create a new tenant
// const createTenant = async (payload: Tenant) => {
//   try {
//     const tenant = new TenantModel(payload);
//     await tenant.save();
//     return tenant;
//   } catch (error) {
//     throw new BadRequestError("Error creating tenant");
//   }
// };

// Retrieve tenant profile by user ID
// const getTenantProfile = async (tenantId: string) => {
//   try {
//     const tenant = await TenantModel.findById(tenantId);
//     if (!tenant) {
//       throw new NotFoundError("Tenant not found");
//     }
//     return tenant;
//   } catch (error) {
//     throw error; // Re-throw to be handled by the controller
//   }
// };

// Create rental request for tenant
const createRentalRequest = async (tenantId: string, listingId: string, additionalMessage: string) => {
  try {
    // Find the user by ID (tenant)
    const tenant = await User.findById(tenantId);
    if (!tenant || tenant.role !== "tenant") {
      throw new NotFoundError("Tenant not found or user is not a tenant");
    }

    // Create a rental request object
    const rentalRequest = {
      listingId: listingId,
      status: "pending" as "pending" | "approved" | "rejected",
      additionalMessage: additionalMessage
    };

    // Ensure rentalRequests is initialized
    if (!tenant.rentalRequests) {
      tenant.rentalRequests = []; // Initialize if undefined
    }

    // Add the rental request to the tenant's rentalRequests array
    tenant.rentalRequests.push(rentalRequest);

    // Save the updated tenant object
    await tenant.save();

    return rentalRequest;
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Error creating rental request");
  }
};

// Get all rental requests made by a tenant
const getRentalRequests = async (tenantId: string) => {
  try {
    const tenant = await User.findById(tenantId);
    console.log(tenantId, tenant)
    if (!tenant) {
      throw new NotFoundError("Tenant not found");
    }
    return tenant.rentalRequests; // Return the tenant's rental requests
  } catch (error) {
    throw error; // Re-throw to be handled by the controller
  }
};

// Update tenant profile
// const updateTenantProfile = async (tenantId: string, payload: Tenant) => {
//   try {
//     const tenant = await TenantModel.findByIdAndUpdate(tenantId, payload, { new: true });
//     if (!tenant) {
//       throw new NotFoundError("Tenant not found");
//     }
//     return tenant;
//   } catch (error) {
//     throw error; // Re-throw to be handled by the controller
//   }
// };

export const TenantService = {
  // createTenant,
  // getTenantProfile,
  createRentalRequest,
  getRentalRequests,
  // updateTenantProfile,
};
