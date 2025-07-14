import { Schema, model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export const Gender = ['male', 'female', 'other'] as const;
export const VehiclesCategory = ['bike', 'car', 'van', 'truck'] as const;

const authenticationSchema = new Schema(
     {
          isResetPassword: { type: Boolean, default: false },
          oneTimeCode: { type: Number },
          expireAt: { type: Date },
     },
     { _id: false },
);

const driverLicenseSchema = new Schema(
     {
          driverLicenseNumber: { type: String },
          licenseExpireDate: { type: Date },
          licensePhoto: { type: String },
     },
     { _id: false },
);

const vehicleInfoSchema = new Schema(
     {
          vehiclesMake: { type: String },
          vehiclesModel: { type: String },
          vehiclesYear: { type: Date },
          vehiclesRegistrationNumber: { type: String },
          vehiclesInsuranceNumber: { type: String },
          vehiclesPhoto: { type: String },
          vehiclesCategory: { type: String, enum: VehiclesCategory },
     },
     { _id: false },
);

const userSchema = new Schema(
     {
          name: { type: String, required: true },
          phoneNumber: { type: String, required: true, unique: true },
          dateOfBirth: { type: Date },
          password: { type: String },
          image: { type: String },
          isDeleted: { type: Boolean, default: false },
          stripeCustomerId: { type: String },
          status: { type: String, enum: ['active', 'blocked'], default: 'active' },
          verified: { type: Boolean, default: false },
          role: { type: String, enum: Object.values(USER_ROLES), required: true },
          authentication: authenticationSchema,
          googleId: { type: String },
          facebookId: { type: String },
          oauthProvider: { type: String, enum: ['google', 'facebook'] },

          // Rider Specific
          gender: { type: String, enum: Gender },
          zone: { type: String },
          driverLicense: driverLicenseSchema,
          vehicleInfo: vehicleInfoSchema,

          // Vendor Specific
          businessInformation: { type: String },
          businessLicense: { type: String },
          businessLicensePhoto: { type: String },
          businessTINNumber: { type: String },
          businessNIDNumber: { type: String },
          businessName: { type: String },
          businessLocation: { type: String },
     },
     {
          timestamps: true,
     },
);

export const User = model('User', userSchema);
