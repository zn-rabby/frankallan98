import { INotification } from '../app/modules/notification/notification.interface';
import { Notification } from '../app/modules/notification/notification.model';

export const sendNotifications = async (data: any): Promise<INotification> => {
     const result = await Notification.create(data);
     //@ts-ignore
     const socketIo = global.io;
     if (socketIo) {
          if (data.receiver) {
               socketIo.emit(`notification::${data?.receiver}`, result);
          } else {
               socketIo.emit(`notification::all`, result);
          }
     }

     return result;
};
