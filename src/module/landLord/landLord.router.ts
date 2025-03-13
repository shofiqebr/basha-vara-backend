import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ListingValidation } from "./landLord.validation";
import { LandlordControllers } from "./landLord.controller";


const landlordRouter = Router();

// Create a new rental house listing
landlordRouter.post(
  "/api/landlords/listings",
  validateRequest(ListingValidation.createListingValidationSchema), // Assuming you will validate listing creation
  LandlordControllers.createListing
);

// Get all rental house listings posted by the landlord
landlordRouter.get("/api/landlords/listings", LandlordControllers.getAllListings);

// Update a specific rental house listing
landlordRouter.put(
  "/api/landlords/listings/:id",
  validateRequest(ListingValidation.updateListingValidationSchema), // Assuming you will validate listing updates
  LandlordControllers.updateListing
);

// Delete a specific rental house listing
landlordRouter.delete("/api/landlords/listings/:id", LandlordControllers.deleteListing);

// Get all rental requests for the listings posted by the landlord
landlordRouter.get("/api/landlords/requests", LandlordControllers.getRentalRequests);

// Respond to a rental request (approve/reject)
landlordRouter.put(
  "/api/landlords/requests/:requestId",
  validateRequest(ListingValidation.respondToRequestValidationSchema), // Assuming you will validate request responses
  LandlordControllers.respondToRentalRequest
);

export default landlordRouter;
