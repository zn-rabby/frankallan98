import { USER_ROLES } from '../../../enums/user';

export type Gender = 'male' | 'female' | 'other';
export type VehiclesCategory = 'bike' | 'car' | 'van' | 'truck'; // extend as needed

// Common Fields
interface IBaseUser {
     name: string;
     phoneNumber: string;
     dateOfBirth?: Date;
     password?: string;
     image?: string;
     isDeleted?: boolean;
     stripeCustomerId?: string;
     status?: 'active' | 'blocked';
     verified?: boolean;
     role?: USER_ROLES;
     authentication?: {
          isResetPassword: boolean;
          oneTimeCode: number;
          expireAt: Date;
     };
     googleId?: string;
     facebookId?: string;
     oauthProvider?: 'google' | 'facebook';
}

// Rider Specific
interface IRiderInfo {
     gender: Gender;
     zone: string;
     driverLicense: {
          driverLicenseNumber: string;
          licenseExpireDate: Date;
          licensePhoto: string;
     };
     vehicleInfo: {
          vehiclesMake: string;
          vehiclesModel: string;
          vehiclesYear: Date;
          vehiclesRegistrationNumber: string;
          vehiclesInsuranceNumber: string;
          vehiclesPhoto: string;
          vehiclesCategory: VehiclesCategory;
     };
}

// Vendor Specific
interface IVendorInfo {
     businessInformation: string;
     businessLicense: string;
     businessLicensePhoto: string;
     businessTINNumber: string;
     businessNIDNumber: string;
     businessName: string;
     businessLocation: string;
}

// Main User Interface
export type IUser = IBaseUser & Partial<IRiderInfo> & Partial<IVendorInfo>;
