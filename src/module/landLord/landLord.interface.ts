// interfaces/landlord.interface.ts
export interface LandlordListing {
  _id?: string; // Optional, if you are using MongoDB, the ID can be auto-generated
  location: string; // Location of the rental house
  description: string; // Detailed description of the rental house
  rentAmount: number; // Rent amount in currency
  numberOfBedrooms: number; // Number of bedrooms in the rental house
  images: string[]; // Array of image URLs for the rental house
  amenities: string;
  category: "Familiy" | "Bachelor" | "Office" | 'Sublet' | 'Hostel'
  landlordId: string; // Reference to the landlord (user) ID
  requests?: {
    [x: string]: string | undefined;
    status: "pending" | "approved" | "rejected";
    tenantId: string; // Tenant's user ID
    phoneNumber?: string ; // Landlord's phone number (optional)
  }[]; 
  createdAt?: Date; // Optional, the date the listing was created
  updatedAt?: Date; // Optional, the date the listing was last updated
}
