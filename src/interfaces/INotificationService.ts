import { IUser } from "./IUser";

export interface INotificationService {
  sendPushNotification(userHandle: string, message: string): Promise<void>;
}