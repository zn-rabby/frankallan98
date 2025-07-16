import { Schema, model } from 'mongoose';
import { IOrder, IDeliveryAddress } from './order.interface'; // adjust import path as needed

// Embedded schema for delivery address
const DeliveryAddressSchema = new Schema<IDeliveryAddress>(
     {
          name: { type: String, required: true },
          phone: { type: Number, required: true },
          districts: { type: String, required: true },
          city: { type: String, required: true },
          ward: { type: String, required: true },
          subWards: { type: String, required: true },
          plotApartmentRoad: { type: String, required: true },
          deliveryTime: { type: Date, required: true },
          deliveryDate: { type: Date, required: true },
     },
     { _id: false }, // prevents creating _id for nested object
);

// Main Order schema
const OrderSchema = new Schema<IOrder>(
     {
          product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
          name: { type: String, required: true },
          phone: { type: Number, required: true },
          price: { type: Number, required: true },
          districts: { type: String, required: true },
          city: { type: String, required: true },
          ward: { type: String, required: true },
          subWards: { type: String, required: true },
          plotApartmentRoad: { type: String, required: true },
          itemDetails: { type: String, required: true },
          pickupTime: { type: Date, required: true },
          serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType', required: true },
          image: { type: String }, // or Schema.Types.ObjectId if referencing another model
          productWeight: { type: Number, required: true },
          quantity: { type: Number, required: true },
          deliveryAddress: { type: DeliveryAddressSchema, required: true },
     },
     { timestamps: true },
);

export const Order = model<IOrder>('Order', OrderSchema);
