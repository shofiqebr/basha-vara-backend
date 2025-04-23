/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { LandlordListing } from "./landLord.interface";
import ListingModel from "./landLord.model";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import User from "../user/user.model";
import { IUser } from "../user/user.interface";
import AppError from "../../errors/AppError";


// Create a new rental house listing
const createListing = async (payload: LandlordListing) => {
    const listing = await ListingModel.create(payload);
    return listing;
};

// Retrieve all listings posted by a specific landlord

export const getAllListings = async (filter: Record<string, any>) => {
    return await ListingModel.find(filter); // Fetch listings based on filter
};


// Update a specific rental listing by ID
const updateListing = async (id: string, payload: LandlordListing) => {
    const updatedListing = await ListingModel.findByIdAndUpdate(id, payload, { new: true });
    return updatedListing;
};

// Delete a rental listing by ID
const deleteListing = async (id: string) => {
    await ListingModel.findByIdAndDelete(id);
    return { message: "Listing deleted successfully" };
};

const getRentalRequests = async (landlordId: string) => {
    // Fetch all listings owned by the landlord
    const listings = await ListingModel.find({ landlordId }).populate({
        path: "requests.tenantId", // Populate tenant details
        model: "User",
        select: "name email phone" // Only retrieve necessary fields
    });

    if (!listings.length) {
        throw new Error("No listings found for this landlord");
    }

    // Extract all rental requests from listings
    const rentalRequests = listings.flatMap((listing) =>
        listing.requests.map((request) => ({
            listingId: listing._id,
            listingLocation: listing.location,
            rentAmount: listing.rentAmount,
            status: request.status,
            tenant: request.tenantId, // Populated tenant details
            phoneNumber: request.phoneNumber || "N/A",
        }))
    );

    return rentalRequests;
};


// Respond to a rental request (approve/reject)
// export const respondToRentalRequest = catchAsync(async (req: Request, res: Response) => {
//     const { requestId } = req.params;
//     const { status, phoneNumber } = req.body;

//     // Ensure status is either 'approved' or 'rejected'
//     if (!["approved", "rejected"].includes(status)) {
//         return sendResponse(res, {
//             status: false,
//             message: "Invalid status. Use 'approved' or 'rejected'.",
//             statusCode: StatusCodes.BAD_REQUEST,
//             data: null,
//         });
//     }

//     // Convert requestId to ObjectId
//     const objectIdRequestId = new mongoose.Types.ObjectId(requestId);
//     console.log("RequestId:", objectIdRequestId); // Debugging log

//     // Find and update the rental request in the listing
//     const updatedListing = await ListingModel.findOneAndUpdate(
//         { "requests._id": objectIdRequestId },
//         {
//             $set: {
//                 "requests.$.status": status,
//                 ...(status === "approved" && phoneNumber ? { "requests.$.phoneNumber": phoneNumber } : {}),
//             },
//         },
//         { new: true }
//     );

//     console.log("Updated Listing:", updatedListing); // Debugging log

//     // If no listing was found or updated
//     if (!updatedListing) {
//         return sendResponse(res, {
//             status: false,
//             message: "Rental request not found.",
//             statusCode: StatusCodes.NOT_FOUND,
//             data: null,
//         });
//     }

//     // Return success response
//     sendResponse(res, {
//         status: true,
//         message: `Rental request has been ${status}.`,
//         statusCode: StatusCodes.OK,
//         data: updatedListing,
//     });
// });

export const respondToRentalRequest = async (
    requestId: string,
    status: 'approved' | 'rejected',
    phoneNumber?: string
  ) => {
    // 1. Validate the status (redundant check if already done in controller)
    if (!['approved', 'rejected'].includes(status)) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid status value');
    }
  
    // 2. Convert and validate requestId
    let objectIdRequestId;
    try {
      objectIdRequestId = new mongoose.Types.ObjectId(requestId);
    } catch (err) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid request ID format');
    }
  
    // 3. Prepare update object
    const updateObj: mongoose.UpdateQuery<IUser> = {
      $set: {
        'rentalRequests.$[elem].status': status,
        ...(status === 'approved' && phoneNumber 
          ? { 'rentalRequests.$[elem].phoneNumber': phoneNumber } 
          : {}),
      },
    };
  
    // 4. Execute the update
    const updatedUser = await User.findOneAndUpdate(
      {
        'rentalRequests._id': objectIdRequestId,
        rentalRequests: { $exists: true },
      },
      updateObj,
      {
        new: true,
        arrayFilters: [{ 'elem._id': objectIdRequestId }],
      }
    );
  
    if (!updatedUser) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Rental request not found');
    }
  
    // 5. Verify the update
    const updatedRequest = updatedUser.rentalRequests?.find(req => 
      req._id.equals(objectIdRequestId)
    );
  
    if (!updatedRequest) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Update completed but request not found in user document'
      );
    }
  
    return {
      request: {
        _id: updatedRequest._id,
        listingId: updatedRequest.listingId,
        status: updatedRequest.status,
        phoneNumber: updatedRequest.phoneNumber,
        additionalMessage: updatedRequest.additionalMessage,
      },
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    };
  };
  
  


export const LandlordService = {
    createListing,
    getAllListings,
    updateListing,
    deleteListing,
    getRentalRequests,
    respondToRentalRequest,
};
