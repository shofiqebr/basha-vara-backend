/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { LandlordService } from "./LandLord.service";
import ListingModel from "./landLord.model";
import mongoose from "mongoose";
import User from "../user/user.model";

const createListing = catchAsync(async (req: Request, res: Response) => {
    const result = await LandlordService.createListing(req.body);

    sendResponse(res, {
        status: true,
        message: "Rental house listing created successfully",
        statusCode: StatusCodes.CREATED,
        data: {
            _id: result._id,
            location: result.location,
            description: result.description,
            rentAmount: result.rentAmount,
            numberOfBedrooms: result.numberOfBedrooms,
            images: result.images,
            amenities: result.amenities,
            landlordId: result.landlordId,
        }
    });
});

const getAllListings = catchAsync(async (req: Request, res: Response) => {
    const { landlordId } = req.query; // Get landlordId from query params

    const filter = landlordId ? { landlordId: landlordId as string } : {}; // Filter by landlordId if provided

    const result = await LandlordService.getAllListings(filter); // Fetch listings

    sendResponse(res, {
        status: true,
        message: "Rental listings fetched successfully",
        statusCode: StatusCodes.OK,
        data: result,
    });
});


const updateListing = catchAsync(async (req: Request, res: Response) => {
    const result = await LandlordService.updateListing(req.params.id, req.body);

    sendResponse(res, {
        status: true,
        message: "Rental house listing updated successfully",
        statusCode: StatusCodes.OK,
        data: result,
    });
});

const deleteListing = catchAsync(async (req: Request, res: Response) => {
    await LandlordService.deleteListing(req.params.id);

    sendResponse(res, {
        status: true,
        message: "Rental house listing deleted successfully",
        statusCode: StatusCodes.OK,
        data: {},
    });
});

export const getRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const { landlordId } = req.query;

    if (!landlordId) {
        return sendResponse(res, {
            status: false,
            message: "Landlord ID is required",
            statusCode: StatusCodes.BAD_REQUEST,
            data: null, // ✅ Fix: Added data field
        });
    }

    // Fetch all listings owned by the landlord
    const listings = await ListingModel.find({ landlordId }).populate({
        path: "requests.tenantId",
        model: "User",
        select: "name email phone",
    });

    if (!listings.length) {
        return sendResponse(res, {
            status: false,
            message: "No listings found for this landlord",
            statusCode: StatusCodes.NOT_FOUND,
            data: null, // ✅ Fix: Added data field
        });
    }

    // Extract all rental requests from listings
    const rentalRequests = listings.flatMap((listing) =>
        listing?.requests?.map((request) => ({
            listingId: listing._id,
            listingLocation: listing.location,
            rentAmount: listing.rentAmount,
            status: request.status,
            tenant: request.tenantId, // Populated tenant details
            phoneNumber: request.phoneNumber || "N/A",
        }))
    );

    sendResponse(res, {
        status: true,
        message: "Rental requests retrieved successfully",
        statusCode: StatusCodes.OK,
        data: rentalRequests,
    });
});

// Approve or Reject a Rental Request
// import { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import { StatusCodes } from 'http-status-codes';
// import { catchAsync } from '../utils/catchAsync';
// import { sendResponse } from '../utils/sendResponse';
// import User from '../models/userModel';
// import Listing from '../models/listingModel';

export const respondToRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { status, phoneNumber } = req.body;
  
    // 1. Validate the status
    if (!["approved", "rejected"].includes(status)) {
      return sendResponse(res, {
        status: false,
        message: "Invalid status. Must be 'approved' or 'rejected'.",
        statusCode: StatusCodes.BAD_REQUEST,
        data: null,
      });
    }
  
    // 2. Convert requestId to ObjectId
    let objectIdRequestId;
    try {
      objectIdRequestId = new mongoose.Types.ObjectId(requestId);
    } catch (err) {
      return sendResponse(res, {
        status: false,
        message: "Invalid request ID format.",
        statusCode: StatusCodes.BAD_REQUEST,
        data: null,
      });
    }
  
    // 3. Prepare the update object
    const updateObj = {
      $set: {
        "rentalRequests.$[elem].status": status,
        ...(status === "approved" && phoneNumber 
          ? { "rentalRequests.$[elem].landlordPhoneNumber": phoneNumber } 
          : {})
      }
    };
  
    // 4. Find and update the user's rental request
    const updatedUser = await User.findOneAndUpdate(
      { 
        "rentalRequests._id": objectIdRequestId,
        "rentalRequests": { $exists: true }
      },
      updateObj,
      { 
        new: true,
        arrayFilters: [{ "elem._id": objectIdRequestId }]
      }
    );
  
    if (!updatedUser) {
      return sendResponse(res, {
        status: false,
        message: "User or rental request not found.",
        statusCode: StatusCodes.NOT_FOUND,
        data: null,
      });
    }
  
    // 5. Find the updated request to include in response
    const updatedRequest = updatedUser.rentalRequests?.find(
      req => req._id.equals(objectIdRequestId)
    );
  
    if (!updatedRequest) {
      return sendResponse(res, {
        status: false,
        message: "Update completed but request not found in user document.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });
    }
  
    // 6. Return success response with only user/request data
    return sendResponse(res, {
      status: true,
      message: `Rental request ${status} successfully.`,
      statusCode: StatusCodes.OK,
      data: {
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email
        },
        request: {
          _id: updatedRequest._id,
          listingId: updatedRequest.listingId,
          status: updatedRequest.status,
          landlordPhoneNumber: updatedRequest.landlordPhoneNumber,
          additionalMessage: updatedRequest.additionalMessage
        }
      },
    });
  });
  

export const LandlordControllers = {
    createListing,
    getAllListings,
    updateListing,
    deleteListing,
    getRentalRequests,
    respondToRentalRequest,
};
