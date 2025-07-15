import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProductToDB = async (payload: IProduct): Promise<IProduct> => {
     const report = await Product.create(payload);
     if (!report) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to created Product ');
     return report;
};

export const ProductService = {
     createProductToDB,
};
