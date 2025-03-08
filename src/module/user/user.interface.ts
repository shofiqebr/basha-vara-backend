import { Model } from "mongoose";
import { USER_ROLE } from "./user.constrants";

export interface IUser  {
    name: string;
    email: string;
    password: string;
    role: USER_ROLE;
    phone?: string;
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