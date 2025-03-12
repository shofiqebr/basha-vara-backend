
import { LandlordListing } from "./landLord.interface";
import ListingModel from "./landLord.model";


// Create a new rental house listing
const createListing = async (payload: LandlordListing) => {
    const listing = await ListingModel.create(payload);
    return listing;
};

// Retrieve all listings posted by a specific landlord
const getAllListings = async (landlordId: string) => {
    const listings = await ListingModel.find({ landlordId }).populate("landlordId");
    return listings;
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

// Retrieve all rental requests for the landlord's listings
const getAllRentalRequests = async (landlordId: string) => {
    const listings = await ListingModel.find({ landlordId }).populate("landlordId");
    const rentalRequests = listings.flatMap((listing) => listing.requests); // Assuming requests are stored in the listing model
    return rentalRequests;
};

// Respond to a rental request (approve/reject)
const respondToRentalRequest = async (
    requestId: string,
    status: string,
    phoneNumber?: string
) => {
    const request = await ListingModel.findOneAndUpdate(
        { "requests._id": requestId },
        {
            $set: {
                "requests.$.status": status,
                ...(status === "approved" && phoneNumber ? { "requests.$.phoneNumber": phoneNumber } : {}),
            },
        },
        { new: true }
    );

    if (!request) {
        throw new Error("Rental request not found.");
    }

    return request;
};

export const LandlordService = {
    createListing,
    getAllListings,
    updateListing,
    deleteListing,
    getAllRentalRequests,
    respondToRentalRequest,
};
