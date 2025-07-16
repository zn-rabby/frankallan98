import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import unlinkFile from '../../../shared/unlinkFile';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrderToDB = async (payload: IOrder): Promise<IOrder> => {
     const data = await Order.create(payload);
     const { image } = payload;

     if (!data) {
          unlinkFile(image);
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create Order');
     }

     if (!data) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to created Order');
     return data;
};

const getAllOrdersFromDB = async (): Promise<IOrder[]> => {
     const result = await Order.find({});
     return result;
};

// Get Single Category by ID
const getSingleOrderFromDB = async (id: string): Promise<IOrder | null> => {
     const order = await Order.findById(id);
     if (!order) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
     }
     return order;
};

export const OrderService = {
     createOrderToDB,
     getAllOrdersFromDB,
     getSingleOrderFromDB,
};
