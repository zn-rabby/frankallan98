import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { OrderService } from './order.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';

const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const { id }: any = req.user;
     const payload = {
          barber: id,
          ...req.body,
     };
     const result = await OrderService.createOrderToDB(payload);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Order Created Successfully',
          data: result,
     });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
     const result = await OrderService.getAllOrdersFromDB();

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order retrieved successfully',
          data: result,
     });
});

// Get Single Category by ID
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await OrderService.getSingleOrderFromDB(id);

     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
     }

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order retrieved successfully',
          data: result,
     });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const updateData = req.body;

     const result = await OrderService.updateOrderToDB(id, updateData);

     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Failed to update order');
     }

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order updated successfully',
          data: result,
     });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id;
     const result = await OrderService.deleteOrderToDB(id);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Order deleted successfully',
          data: { id },
     });
});

export const OrderController = {
     createProduct,
     getAllOrder,
     getSingleOrder,
     updateOrder,
     deleteOrder,
};
