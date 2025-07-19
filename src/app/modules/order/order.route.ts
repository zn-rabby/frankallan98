import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import parseFileData from '../../middleware/parseFileData';
import { OrderController } from './order.controller';
const router = express.Router();

router.post('/', fileUploadHandler(), parseFileData('image'), auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), OrderController.createProduct);
router.get('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), OrderController.getAllOrder);
router.get('/:id', auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), OrderController.getSingleOrder);
router.patch('/:id', fileUploadHandler(), parseFileData('image'), auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), OrderController.updateOrder);

export const OrderRoutes = router;
