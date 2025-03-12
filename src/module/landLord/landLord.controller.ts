import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { LandlordService } from "./LandLord.service";

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
    const result = await LandlordService.getAllListings(req.query.landlordId as string);

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

const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const result = await LandlordService.getAllRentalRequests(req.query.landlordId as string);

    sendResponse(res, {
        status: true,
        message: "Rental requests fetched successfully",
        statusCode: StatusCodes.OK,
        data: result,
    });
});

const respondToRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const { status, phoneNumber } = req.body;
    const result = await LandlordService.respondToRentalRequest(req.params.id, status, phoneNumber);

    sendResponse(res, {
        status: true,
        message: `Rental request ${status} successfully`,
        statusCode: StatusCodes.OK,
        data: result,
    });
});

export const LandlordControllers = {
    createListing,
    getAllListings,
    updateListing,
    deleteListing,
    getAllRentalRequests,
    respondToRentalRequest,
};
