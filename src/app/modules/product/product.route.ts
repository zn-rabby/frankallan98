import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import { ProductController } from './product.controller';
const router = express.Router();

router.post('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.VENDOR), ProductController.createProduct);

export const ProductRoutes = router;
