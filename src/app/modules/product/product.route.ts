import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import { ProductController } from './product.controller';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import parseFileData from '../../middleware/parseFileData';
const router = express.Router();

router.post('/', fileUploadHandler(), parseFileData('image'), auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), ProductController.createProduct);
router.get('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), ProductController.getAllProduct);
router.get('/:id', auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), ProductController.getSingleProduct);
router.patch('/:id', fileUploadHandler(), parseFileData('image'), auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), ProductController.updateProduct);
router.delete('/:id', auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), ProductController.deleteProduct);

export const ProductRoutes = router;
