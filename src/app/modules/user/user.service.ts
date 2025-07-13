import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import { IUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../../errors/AppError';
import generateOTP from '../../../utils/generateOTP';
// create user
const createUserToDB = async (payload: IUser): Promise<IUser> => {
     //set role
     const user = await User.isExistUserByEmail(payload.email);
     if (user) {
          throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
     }
     payload.role = USER_ROLES.USER;
     const createUser = await User.create(payload);
     if (!createUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
     }

     //send email
     const otp = generateOTP(4);
     const values = {
          name: createUser.name,
          otp: otp,
          email: createUser.email!,
     };
     const createAccountTemplate = emailTemplate.createAccount(values);
     emailHelper.sendEmail(createAccountTemplate);

     //save to DB
     const authentication = {
          oneTimeCode: otp,
          expireAt: new Date(Date.now() + 3 * 60000),
     };
     await User.findOneAndUpdate({ _id: createUser._id }, { $set: { authentication } });

     return createUser;
};



// create Admin
const createAdminToDB = async (payload: Partial<IUser>): Promise<IUser> => {
     //set role
     payload.role = USER_ROLES.ADMIN;
     const createAdmin = await User.create(payload);
     if (!createAdmin) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
     }

     //send email
     const otp = generateOTP(6);
     const values = {
          name: createAdmin.name,
          otp: otp,
          email: createAdmin.email!,
     };
     const createAccountTemplate = emailTemplate.createAccount(values);
     emailHelper.sendEmail(createAccountTemplate);

     //save to DB
     const authentication = {
          oneTimeCode: otp,
          expireAt: new Date(Date.now() + 3 * 60000),
     };
     await User.findOneAndUpdate(
          { _id: createAdmin._id },
          { $set: { authentication } }
     );

     return createAdmin;
};

// get user profile
const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     return isExistUser;
};

// update user profile
const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     //unlink file here
     if (payload.image) {
          unlinkFile(isExistUser.image);
     }

     const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
          new: true,
     });

     return updateDoc;
};

const verifyUserPassword = async (userId: string, password: string) => {
     const user = await User.findById(userId).select('+password');
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
     }
     const isPasswordValid = await User.isMatchPassword(password, user.password || '');
     return isPasswordValid;
};

const deleteUser = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     await User.findByIdAndUpdate(id, {
          $set: { isDeleted: true },
     });

     return true;
};

// ========== USER SEARCH AND MANAGEMENT METHODS ==========

// Find user by ID
const findUserById = async (id: string): Promise<IUser | null> => {
     return await User.findById(id);
};

// Find user by email
const findUserByEmail = async (email: string): Promise<IUser | null> => {
     return await User.findOne({ email });
};

// Find user by Google ID
const findUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
     return await User.findOne({ googleId });
};

// Find user by Facebook ID
const findUserByFacebookId = async (facebookId: string): Promise<IUser | null> => {
     return await User.findOne({ facebookId });
};

// Find all users (with pagination)
const findAllUsers = async (page: number = 1, limit: number = 10) => {
     const skip = (page - 1) * limit;
     const users = await User.find({ isDeleted: { $ne: true } })
          .skip(skip)
          .limit(limit)
          .select('-password');
     
     const total = await User.countDocuments({ isDeleted: { $ne: true } });
     
     return {
          users,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
     };
};

// Find users by role
const findUsersByRole = async (role: USER_ROLES, page: number = 1, limit: number = 10) => {
     const skip = (page - 1) * limit;
     const users = await User.find({ role, isDeleted: { $ne: true } })
          .skip(skip)
          .limit(limit)
          .select('-password');
     
     const total = await User.countDocuments({ role, isDeleted: { $ne: true } });
     
     return {
          users,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
     };
};

// Find OAuth users
const findOAuthUsers = async (provider?: 'google' | 'facebook') => {
     const query = { 
          oauthProvider: { $exists: true, $ne: null },
          isDeleted: { $ne: true }
     };
     
     if (provider) {
          (query as any).oauthProvider = provider;
     }
     
     return await User.find(query).select('-password');
};

// Find local users (non-OAuth)
const findLocalUsers = async () => {
     return await User.find({ 
          oauthProvider: { $exists: false },
          isDeleted: { $ne: true }
     }).select('-password');
};

// Search users by name or email
const searchUsers = async (searchTerm: string, page: number = 1, limit: number = 10) => {
     const skip = (page - 1) * limit;
     const regex = new RegExp(searchTerm, 'i');
     
     const users = await User.find({
          $or: [
               { name: regex },
               { email: regex }
          ],
          isDeleted: { $ne: true }
     })
     .skip(skip)
     .limit(limit)
     .select('-password');
     
     const total = await User.countDocuments({
          $or: [
               { name: regex },
               { email: regex }
          ],
          isDeleted: { $ne: true }
     });
     
     return {
          users,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
     };
};

// Get user statistics
const getUserStats = async () => {
     const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });
     const googleUsers = await User.countDocuments({ googleId: { $exists: true, $ne: null } });
     const facebookUsers = await User.countDocuments({ facebookId: { $exists: true, $ne: null } });
     const localUsers = await User.countDocuments({ 
          oauthProvider: { $exists: false },
          isDeleted: { $ne: true }
     });
     const verifiedUsers = await User.countDocuments({ verified: true, isDeleted: { $ne: true } });
     const blockedUsers = await User.countDocuments({ status: 'blocked', isDeleted: { $ne: true } });
     
     return {
          totalUsers,
          googleUsers,
          facebookUsers,
          localUsers,
          verifiedUsers,
          blockedUsers
     };
};

// Link OAuth account to existing user
const linkOAuthAccount = async (userId: string, provider: 'google' | 'facebook', providerId: string) => {
     const user = await User.findById(userId);
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }
     
     const updateData: any = {
          oauthProvider: provider,
          verified: true
     };
     
     if (provider === 'google') {
          updateData.googleId = providerId;
     } else if (provider === 'facebook') {
          updateData.facebookId = providerId;
     }
     
     return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

// Unlink OAuth account
const unlinkOAuthAccount = async (userId: string, provider: 'google' | 'facebook') => {
     const user = await User.findById(userId);
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }
     
     const updateData: any = {};
     
     if (provider === 'google') {
          updateData.googleId = null;
          updateData.oauthProvider = user.facebookId ? 'facebook' : null;
     } else if (provider === 'facebook') {
          updateData.facebookId = null;
          updateData.oauthProvider = user.googleId ? 'google' : null;
     }
     
     return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

export const UserService = {
     createUserToDB,
     getUserProfileFromDB,
     updateProfileToDB,
     createAdminToDB,
     deleteUser,
     verifyUserPassword,
     // New search and management methods
     findUserById,
     findUserByEmail,
     findUserByGoogleId,
     findUserByFacebookId,
     findAllUsers,
     findUsersByRole,
     findOAuthUsers,
     findLocalUsers,
     searchUsers,
     getUserStats,
     linkOAuthAccount,
     unlinkOAuthAccount,
};
