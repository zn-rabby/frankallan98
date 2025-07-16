import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { TanzaniaRoutes } from '../app/modules/tanzania/tanzania.route';
import { OrderRoutes } from '../app/modules/order/order.route';

const router = express.Router();
const routes = [
     {
          path: '/auth',
          route: AuthRouter,
     },
     {
          path: '/users',
          route: UserRouter,
     },
     {
          path: '/products',
          route: ProductRoutes,
     },
     {
          path: '/tanzania',
          route: TanzaniaRoutes,
     },
     {
          path: '/orders',
          route: OrderRoutes,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
