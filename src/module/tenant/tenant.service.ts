/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */

import { BadRequestError, NotFoundError } from "../../errors/errors";
import ListingModel from "../landLord/landLord.model";
import User from "../user/user.model";
import { UpdateRentalRequestInput } from "./tenant.interface";
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
const createRentalRequest = async (
  tenantId: string,
  listingId: string,
  additionalMessage: string
) => {
  try {
    // Find tenant
    const tenant = await User.findById(tenantId);
    if (!tenant || tenant.role !== "tenant") {
      throw new NotFoundError("Tenant not found or user is not a tenant");
    }

    // Find listing
    const listing = await ListingModel.findById(listingId);
    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    const landlordId = listing.landlordId; // 👈 Extract landlordId from listing
    if (!landlordId) {
      throw new BadRequestError("Landlord ID not found in listing");
    }

    const rentalRequest = {
      tenantId,
      landlordId, // 👈 Save landlordId in the request
      listingId,
      status: "pending" as const,
      additionalMessage,
    };

    // Initialize if needed and push to listing
    if (!listing.requests) listing.requests = [];
    listing.requests.push(rentalRequest);
    await listing.save();

    // Also add to tenant side
    if (!tenant.rentalRequests) tenant.rentalRequests = [];
    tenant.rentalRequests.push({
      listingId,
      landlordId, // 👈 Save landlordId here too
      status: "pending",
      additionalMessage,
    });
    await tenant.save();

    return rentalRequest;
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Error creating rental request");
  }
};



const getAllRentalRequests = async () => {
  try {
    // Find all users with role "tenant"
    const tenants = await User.find({ role: "tenant" });

    // Extract rental requests from each tenant
    const allRentalRequests = tenants.flatMap(tenant =>
      tenant?.rentalRequests?.map(request => ({
        tenantId: tenant._id,
        tenantName: tenant.name, // Assuming user has a name field
        tenantEmail: tenant.email,
        ...request
      }))
    );

    return allRentalRequests;
  } catch (error) {
    throw new BadRequestError("Error retrieving rental requests");
  }
};

// update rental request

const updateRentalRequest = async (
  tenantId: string,
  listingId: string,
  updateData: UpdateRentalRequestInput
) => {
  const tenant = await User.findById(tenantId);

  if (!tenant || tenant.role !== "tenant") {
    throw new NotFoundError("Tenant not found or invalid role");
  }

  // Ensure rentalRequests is initialized
  if (!tenant.rentalRequests) {
    tenant.rentalRequests = [];
  }

  // Find the request to update
  const tenantRequest = tenant.rentalRequests.find(
    (req) => req.listingId.toString() === listingId
  );

  if (!tenantRequest) {
    throw new NotFoundError("Rental request not found in tenant");
  }

  // Update fields if provided
  if (updateData.additionalMessage !== undefined) {
    tenantRequest.additionalMessage = updateData.additionalMessage;
  }

  if (updateData.status !== undefined) {
    tenantRequest.status = updateData.status;
  }

  if (updateData?.landlordPhoneNumber !== undefined) {
    tenantRequest.landlordPhoneNumber = updateData?.landlordPhoneNumber;
  }

  await tenant.save();

  return {
    message: "Rental request updated successfully",
    updatedRequest: tenantRequest,
  };
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

const updateTenantProfile = async (tenantId: string, updateData: any) => {
  const tenant = await User.findById(tenantId);

  if (!tenant || tenant.role !== "tenant") {
      throw new Error("Tenant not found or not authorized to update");
  }

  Object.assign(tenant, updateData); // Update only provided fields
  await tenant.save();

  return tenant;
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
  getAllRentalRequests,
  updateTenantProfile,
  updateRentalRequest
};
