/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string; // Hashed password
  role: "admin" | "landlord" | "tenant";
  address?: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

  export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateToken(): string;
  }
  
  // Create a new Model type that knows about IUserMethods...
  type TUserModel = Model<IUser, {}, IUserMethods>;
  
  export default TUserModel;