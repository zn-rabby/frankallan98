import { Model, Types } from 'mongoose';
export type IDeliveryAddress = {
     name: string;
     phone: number;
     districts: string;
     city: string;
     ward: string;
     subWards: string;
     plotApartmentRoad: string;
     deliveryTime: Date;
     deliveryDate: Date;
};

export type IOrder = {
     product: Types.ObjectId;
     name: string;
     phone: number;
     price: number;
     districts: string;
     city: string;
     ward: string;
     subWards: string;
     plotApartmentRoad: string;
     itemDetails: string;
     pickupTime: Date;
     serviceType: Types.ObjectId;
     image: string;
     productWeight: number;
     quantity: number;
     deliveryAddress: IDeliveryAddress;
};

export type ProductModel = Model<IOrder, Record<string, unknown>>;
