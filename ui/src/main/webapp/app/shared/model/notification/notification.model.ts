import { Moment } from 'moment';
import { NotificationType } from 'app/shared/model/enumerations/notification-type.model';

export interface INotification {
  id?: string;
  date?: Moment;
  details?: string;
  sentDate?: Moment;
  format?: NotificationType;
  userId?: number;
  productId?: number;
}

export const defaultValue: Readonly<INotification> = {};
