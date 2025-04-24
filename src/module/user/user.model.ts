/* eslint-disable @typescript-eslint/no-empty-object-type */
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserMethods } from "./user.interface";
import config from "../../app/config";

// Define user schema
const UserSchema = new Schema<IUser, mongoose.Model<IUser, {}, IUserMethods>, IUserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "landlord", "tenant"],
      default: "tenant",
    },
    phone: { type: String },
    address: { type: String, default: "N/A" },
    city: { type: String, default: "N/A" },
    isActive: {type: Boolean, default: "Active"},
    
    // Add rentalRequests field for tenants
    rentalRequests: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        listingId: { type: String, required: true },
        landlordId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        additionalMessage: { type: String },
        landlordPhoneNumber: { type: String },
        phoneNumber: { type: String },
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (!this.password) throw new Error("Password is required for hashing.");

  const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);

  next();
});

// Password Comparison Method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Post-save hook to clear password from response
UserSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// Define User Model
const User = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>("User", UserSchema);

export default User;
