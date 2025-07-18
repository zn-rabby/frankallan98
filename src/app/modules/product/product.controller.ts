import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ProductService } from './product.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';

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

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
     const result = await ProductService.getAllProductsFromDB();

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Product retrieved successfully',
          data: result,
     });
});

// Get Single Category by ID
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await ProductService.getSingleProductFromDB(id);

     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
     }

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Product retrieved successfully',
          data: result,
     });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const updateData = req.body;

     const result = await ProductService.updateProductToDB(id, updateData);

     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Failed to update product');
     }

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Product updated successfully',
          data: result,
     });
});
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id;
     const result = await ProductService.deleteProductToDB(id);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Product deleted successfully',
          data: { id }, // ✅ id + name দুইটাই পাঠানো
     });
});

export const ProductController = {
     createProduct,
     getAllProduct,
     getSingleProduct,
     updateProduct,
     deleteProduct,
};
