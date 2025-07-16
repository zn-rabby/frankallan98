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
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create Product');
     }

     if (!data) throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to created Product ');
     return data;
};

const getAllProductsFromDB = async (): Promise<IProduct[]> => {
     const result = await Product.find({});
     return result;
};

// Get Single Category by ID
const getSingleProductFromDB = async (id: string): Promise<IProduct | null> => {
     const product = await Product.findById(id);
     if (!product) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
     }
     return product;
};

const updateProductToDB = async (id: string, payload: IProduct) => {
     const isExistProduct: any = await Product.findById(id);

     if (!isExistProduct) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Product doesn't exist");
     }

     if (payload.image) {
          unlinkFile(isExistProduct?.image);
     }

     const updateProduct = await Product.findOneAndUpdate({ _id: id }, payload, {
          new: true,
     });

     return updateProduct;
};

const deleteProductToDB = async (id: string): Promise<IProduct | null> => {
     const deleteService = await Product.findByIdAndDelete(id);
     if (!deleteService) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Product doesn't exist");
     }
     return deleteService;
};

export const ProductService = {
     createProductToDB,
     getAllProductsFromDB,
     getSingleProductFromDB,
     updateProductToDB,
     deleteProductToDB,
};
