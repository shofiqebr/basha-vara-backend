/* eslint-disable @typescript-eslint/no-empty-object-type */
// interfaces/user.interface.ts
import { Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string; // Hashed password
  role: "admin" | "landlord" | "tenant"; // Tenant role
  address?: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Additional tenant-specific fields
  rentalRequests?: {
    listingId: string;
    status: "pending" | "approved" | "rejected";
    additionalMessage?: string;
    landlordPhoneNumber?: string;
  }[]; // Track rental requests made by tenant
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateToken(): string;
}

// Create a new Model type that knows about IUserMethods...
type TUserModel = Model<IUser, {}, IUserMethods>;

export default TUserModel;
