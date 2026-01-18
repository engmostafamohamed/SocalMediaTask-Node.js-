import { INotificationService } from "../interfaces/INotificationService";

export class NotificationService implements INotificationService {
  async sendPushNotification(userHandle: string, message: string): Promise<void> {
    console.log(`[PUSH NOTIFICATION] To @${userHandle}: ${message}`);
  }
}
