import { Model, Types } from 'mongoose';

export type IProduct = {
     name: string;
     discription: string;
     price: number;
     category: Types.ObjectId;
     productSize: string;
     productWeight: string;
     image: string;
     productColor: string;
};

export type ProductModel = Model<IProduct, Record<string, unknown>>;
