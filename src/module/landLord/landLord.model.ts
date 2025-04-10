// models/listing.model.ts
import mongoose, { Document, Schema } from "mongoose";
import { LandlordListing } from "./landLord.interface";

const ListingSchema: Schema = new Schema(
  {
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
      min: [0, 'Rent amount must be positive'],
    },
    numberOfBedrooms: {
      type: Number,
      required: true,
      min: [1, 'Number of bedrooms must be at least 1'],
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
    },
    amenities: {
      type: String
    },
    landlordId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User collection (Landlord)
      ref: "User", // Assuming you have a 'User' collection for Landlords
      required: true,
    },
    requests: {
      type: [{
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        phoneNumber: { type: String },
      }],
      default: [],
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create and export the model
const ListingModel = mongoose.model<LandlordListing & Document>("Listing", ListingSchema);

export default ListingModel;
