import {
    NotificationPaginationResponse,
    NotificationResponse,
    NotificationUnseenResponse,
} from '../types';
import { BaseModule } from './base';

export class NotificationsModule extends BaseModule {
    /**
     * Get notifications
     */
    public async getNotifications(
        page: number = 1,
        size: number = 15,
    ): Promise<NotificationPaginationResponse> {
        return this.client.get<NotificationPaginationResponse>(
            '/notifications',
            {
                page,
                size,
            },
        );
    }

    /**
     * Get unseen notifications count
     */
    public async getUnseenCount(): Promise<NotificationUnseenResponse> {
        return this.client.get<NotificationUnseenResponse>(
            '/notifications/count',
        );
    }

    /**
     * Mark notification as seen
     */
    public async markAsSeen(reference: string): Promise<NotificationResponse> {
        return this.client.post<NotificationResponse>(
            `/notifications/${reference}/seen`,
        );
    }
}
