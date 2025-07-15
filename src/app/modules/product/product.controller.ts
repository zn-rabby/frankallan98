import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ProductService } from './product.service';
import sendResponse from '../../../shared/sendResponse';

const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const { id }: any = req.user;
     const payload = {
          barber: id,
          ...req.body,
     };
     const result = await ProductService.createProductToDB(payload);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Product Created Successfully',
          data: result,
     });
});

export const ProductController = {
     createProduct,
};
