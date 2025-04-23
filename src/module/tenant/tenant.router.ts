import express from "express";
import { TenantControllers } from "./tenant.controller";



const tenantRouter = express.Router();

// Create a new tenant
// tenantRouter.post("/api/tenants", TenantControllers.createTenant);

// Get tenant profile by user ID
// tenantRouter.get("/api/tenants/:userId", TenantControllers.getTenantProfile);

// Create a rental request
tenantRouter.post("/api/tenants/requests", TenantControllers.createRentalRequest);

// Get all rental requests made by a tenant
// tenantRouter.get("/api/tenants/requests", TenantControllers.getRentalRequests);
tenantRouter.get("/api/tenants/requests", TenantControllers.getAllRentalRequests);

tenantRouter.put("/api/tenants/requests/:tenantId/:listingId", TenantControllers.updateRentalRequestController);

tenantRouter.put("/api/tenants/profile", TenantControllers.updateTenantProfile);

// Update tenant profile
// tenantRouter.put("/api/tenants/profile/:userId", TenantControllers.updateTenantProfile);

// Optional: You can add more routes like update or delete rental requests
// tenantRouter.put("/tenants/requests/:id", TenantControllers.updateRentalRequest);
// tenantRouter.delete("/tenants/requests/:id", TenantControllers.deleteRentalRequest);

export default tenantRouter;
