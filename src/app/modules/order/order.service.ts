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

const updateOrderToDB = async (id: string, payload: IOrder) => {
     const isExistProduct: any = await Order.findById(id);

     if (!isExistProduct) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Order doesn't exist");
     }

     if (payload.image) {
          unlinkFile(isExistProduct?.image);
     }

     const updateProduct = await Order.findOneAndUpdate({ _id: id }, payload, {
          new: true,
     });

     return updateProduct;
};

const deleteOrderToDB = async (id: string): Promise<IOrder | null> => {
     const deleteService = await Order.findByIdAndDelete(id);
     if (!deleteService) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Product doesn't exist");
     }
     return deleteService;
};

export const OrderService = {
     createOrderToDB,
     getAllOrdersFromDB,
     getSingleOrderFromDB,
     updateOrderToDB,
     deleteOrderToDB,
};
