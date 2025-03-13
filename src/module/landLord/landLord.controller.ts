import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { LandlordService } from "./LandLord.service";
import ListingModel from "./landLord.model";
import mongoose from "mongoose";

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
export const respondToRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { status, phoneNumber } = req.body;
  
    // Log incoming request data for debugging
    console.log("Request ID:", requestId);
    console.log("Status:", status);
    console.log("Phone Number:", phoneNumber);
  
    // Check if status is valid
    if (!["approved", "rejected"].includes(status)) {
      return sendResponse(res, {
        status: false,
        message: "Invalid status. Use 'approved' or 'rejected'.",
        statusCode: StatusCodes.BAD_REQUEST,
        data: null,
      });
    }
  
    // Convert requestId to ObjectId
    const objectIdRequestId = new mongoose.Types.ObjectId(requestId);
  
    // Log the ObjectId
    console.log("Converted ObjectId:", objectIdRequestId);
  
    // Try to update the rental request
    const updatedListing = await ListingModel.findOneAndUpdate(
      { "requests._id": objectIdRequestId },
      {
        $set: {
          "requests.$.status": status,
          ...(status === "approved" && phoneNumber ? { "requests.$.phoneNumber": phoneNumber } : {}),
        },
      },
      { new: true }
    );
  
    // Log the result of the update
    console.log("Updated Listing:", updatedListing);
  
    if (!updatedListing) {
      return sendResponse(res, {
        status: false,
        message: "Rental request not found.",
        statusCode: StatusCodes.NOT_FOUND,
        data: null,
      });
    }
  
    sendResponse(res, {
      status: true,
      message: `Rental request has been ${status}.`,
      statusCode: StatusCodes.OK,
      data: updatedListing,
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
