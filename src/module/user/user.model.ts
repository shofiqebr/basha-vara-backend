import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import TUserModel, { IUser, IUserMethods } from "./user.interface";
import { USER_ROLE } from "./user.constrants";
import config from "../../app/config";

const UserSchema = new Schema<IUser, TUserModel, IUserMethods>(
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
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.customer,
    },
    phone: { type: String, default: "N/A" },
    address: { type: String, default: "N/A" },
    city: { type: String, default: "N/A" },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  // Check if the password is being modified
  if (!user.isModified('password')) {
      return next();
  }

  // Ensure password is present
  if (!user.password) {
      throw new Error('Password is required for hashing.');
  }

  // Ensure bcrypt salt rounds are set properly
  const saltRounds = Number(config.bcrypt_salt_rounds);
  if (isNaN(saltRounds) || saltRounds <= 0) {
      throw new Error('Invalid bcrypt salt rounds configuration.');
  }

  // Hash the password
  user.password = await bcrypt.hash(user.password, saltRounds);

  next();
});


UserSchema.post('save', function(doc, next){
  doc.password = '';
  next();
})

// Generate JWT token method
// UserSchema.methods.generateToken = function (): string {
//   if (!config.jwt.access_secret) {
//     throw new Error("JWT secret is missing");
//   }

//   return jwt.sign(
//     { email: this.email, role: this.role }, // Payload
//     config.jwt.access_secret, // Secret key
//     { expiresIn: config.jwt.access_expires_in } // Options
//   );
// };

const User = mongoose.model<IUser, TUserModel>("User", UserSchema);

export default User;