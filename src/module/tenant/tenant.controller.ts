import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TenantService } from "./tenant.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BadRequestError, NotFoundError } from "../../errors/errors";
// import {updateRentalRequest } from './tenant.service'

// import { TenantService } from "./Tenant.service"; // Assuming you have a Tenant service for logic
// import { NotFoundError, BadRequestError } from "../../../utils/errors"; // Import your custom errors

// Controller for creating a tenant
// const createTenant = catchAsync(async (req: Request, res: Response) => {
//     const result = await TenantService.createTenant(req.body);

//     sendResponse(res, {
//         status: true,
//         message: "Tenant created successfully",
//         statusCode: StatusCodes.CREATED,
//         data: {
//             _id: result._id,
//             name: result.name,
//             email: result.email,
//             phoneNumber: result.phoneNumber,
//             address: result.address,
//         },
//     });
// });

// Controller for fetching tenant profile by userId
// const getTenantProfile = catchAsync(async (req: Request, res: Response) => {
//     const result = await TenantService.getTenantProfile(req.params.userId);

//     sendResponse(res, {
//         status: true,
//         message: "Tenant profile fetched successfully",
//         statusCode: StatusCodes.OK,
//         data: result,
//     });
// });

// Controller for updating tenant profile
// const updateTenantProfile = catchAsync(async (req: Request, res: Response) => {
//     const result = await TenantService.updateTenantProfile(req.params.userId, req.body);

//     sendResponse(res, {
//         status: true,
//         message: "Tenant profile updated successfully",
//         statusCode: StatusCodes.OK,
//         data: result,
//     });
// });

// Controller for creating a rental request
const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const {
      tenantId,
      listingId,
      additionalMessage,
      moveInDate,
      rentalDuration,
      specialRequirements,
    } = req.body;
  
    try {
      const rentalRequest = await TenantService.createRentalRequest(
        tenantId,
        listingId,
        additionalMessage,
        moveInDate,
        rentalDuration,
        specialRequirements
      );
  
      sendResponse(res, {
        status: true,
        message: "Rental request created successfully",
        statusCode: StatusCodes.CREATED,
        data: rentalRequest,
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        sendResponse(res, {
          status: false,
          message: error.message,
          statusCode: error.statusCode,
          data: {},
        });
      } else {
        sendResponse(res, {
          status: false,
          message: "Internal Server Error",
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          data: {},
        });
      }
    }
  });
  

const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const result = await TenantService.getAllRentalRequests();

    sendResponse(res, {
        status: true,
        message: "All rental requests fetched successfully",
        statusCode: StatusCodes.OK,
        data: result,
    });
});


// Controller for fetching all rental requests of a tenant
const getRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const result = await TenantService.getRentalRequests(req.query.tenantId as string);

    sendResponse(res, {
        status: true,
        message: "Rental requests fetched successfully",
        statusCode: StatusCodes.OK,
        data: result,
    });
});

const updateRentalRequestController = catchAsync(
    async (req: Request, res: Response) => {
      const { tenantId, listingId } = req.params;
      const { additionalMessage, status } = req.body;
  
      const updated = await TenantService.updateRentalRequest(tenantId, listingId, {
        tenantId,
        listingId,
        additionalMessage,
        status,
      });
  
      res.status(200).json(updated);
    }
  );

const updateTenantProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { tenantId, ...updateData } = req.body;

    if (!tenantId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Tenant ID is required" });
        return;
    }

    const result = await TenantService.updateTenantProfile(tenantId, updateData);

    sendResponse(res, {
        status: true,
        message: "Tenant profile updated successfully",
        statusCode: StatusCodes.OK,
        data: result,
    });
});


// Controller for updating a rental request
// const updateRentalRequest = catchAsync(async (req: Request, res: Response) => {
//     const result = await TenantService.updateRentalRequest(req.params.id, req.body);

//     sendResponse(res, {
//         status: true,
//         message: "Rental request updated successfully",
//         statusCode: StatusCodes.OK,
//         data: result,
//     });
// });

// // Controller for deleting a rental request
// const deleteRentalRequest = catchAsync(async (req: Request, res: Response) => {
//     await TenantService.deleteRentalRequest(req.params.id);

//     sendResponse(res, {
//         status: true,
//         message: "Rental request deleted successfully",
//         statusCode: StatusCodes.OK,
//         data: {},
//     });
// });

export const TenantControllers = {
    // createTenant,
    // getTenantProfile,
    // updateTenantProfile,
    createRentalRequest,
    getRentalRequests,
    getAllRentalRequests,
    updateTenantProfile,
    // updateRentalRequest,
    // deleteRentalRequest,
    updateRentalRequestController
};
