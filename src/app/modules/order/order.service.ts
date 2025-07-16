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

export const OrderService = {
     createOrderToDB,
};
