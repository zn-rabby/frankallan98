import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import { MongoAPIError } from 'mongodb';
import unlinkFile from '../../../shared/unlinkFile';

const createProductToDB = async (payload: IProduct): Promise<IProduct> => {
     const data = await Product.create(payload);
     const { image } = payload;

     if (!data) {
          unlinkFile(image);
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create Service');
     }

     if (!data) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to created Product ');
     return data;
};

export const ProductService = {
     createProductToDB,
};
