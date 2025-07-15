// src/app/modules/product/product.model.ts

import { Schema, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

const ProductSchema = new Schema<IProduct>(
     {
          name: {
               type: String,
               required: true,
               trim: true,
          },
          discription: {
               type: String,
               required: true,
          },
          price: {
               type: Number,
               required: true,
          },
          category: {
               type: Schema.Types.ObjectId,
               ref: 'Category',
               required: true,
          },
          productSize: {
               type: String,
               required: true,
          },
          productWeight: {
               type: String,
               required: true,
          },
          image: {
               type: String,
               required: true,
          },
          productColor: {
               type: String,
               required: true,
          },
     },
     {
          timestamps: true,
          toJSON: {
               virtuals: true,
          },
     },
);

export const Product = model<IProduct, ProductModel>('Product', ProductSchema);
