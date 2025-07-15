import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
const router = express.Router();

router.post(
     '/login',
     validateRequest(AuthValidation.createLoginZodSchema),
     AuthController.loginUser,
);
router.post('/refresh-token', AuthController.refreshToken);
router.post(
     '/forget-password',
     validateRequest(AuthValidation.createForgetPasswordZodSchema),
     AuthController.forgetPassword,
);

router.post(
     '/verify-phone',
     validateRequest(AuthValidation.createVerifyPhoneZodSchema),
     AuthController.verifyPhone,
);

router.post(
     '/reset-password',
     validateRequest(AuthValidation.createResetPasswordZodSchema),
     AuthController.resetPassword,
);
router.post(
     '/dashboard/forget-password',
     validateRequest(AuthValidation.createForgetPasswordZodSchema),
     AuthController.forgetPasswordByUrl,
);

router.post(
     '/dashboard/reset-password',
     auth(USER_ROLES.ADMIN, USER_ROLES.USER),
     validateRequest(AuthValidation.createResetPasswordZodSchema),
     AuthController.resetPasswordByUrl,
);

router.post(
     '/change-password',
     auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
     validateRequest(AuthValidation.createChangePasswordZodSchema),
     AuthController.changePassword,
);
router.post('/resend-otp', AuthController.resendOtp);

export const AuthRouter = router;