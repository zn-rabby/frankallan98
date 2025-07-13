import { model, Schema } from 'mongoose';
import { IReport, ReportModel } from './report.interface';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';

const reportSchema = new Schema<IReport, ReportModel>(
     {
          customer: {
               type: Schema.Types.ObjectId,
               required: true,
               ref: 'User',
          },
          barber: {
               type: Schema.Types.ObjectId,
               required: true,
               ref: 'User',
          },
          reservation: {
               type: Schema.Types.ObjectId,
               required: true,
               ref: 'Reservation',
          },
          reason: [
               {
                    type: String,
                    required: true,
               },
          ],
     },
     { timestamps: true },
);

export const Report = model<IReport, ReportModel>('Report', reportSchema);
