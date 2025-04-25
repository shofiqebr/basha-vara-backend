import { Router } from "express";
import { AuthControllers } from "../auth/auth.controller";
import { LandlordControllers } from "../landLord/landLord.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ListingValidation } from "../landLord/landLord.validation";




const adminRouter = Router();

// Manage users
adminRouter.get("/api/admin/users", AuthControllers.getAllUsers);
adminRouter.put("/api/admin/users/:id",  AuthControllers.updateUser);
adminRouter.delete("/api/admin/users/:id", AuthControllers.deleteUser);

// Manage listings
adminRouter.get("/api/admin/listings", LandlordControllers.getAllListings);

// Update a specific rental house listing
adminRouter.put(
  "/api/admin/listings/:id",
  validateRequest(ListingValidation.updateListingValidationSchema), // Assuming you will validate listing updates
  LandlordControllers.updateListing
);

// Delete a specific rental house listing
adminRouter.delete("/api/admin/listings/:id", LandlordControllers.deleteListing);




export default adminRouter;
