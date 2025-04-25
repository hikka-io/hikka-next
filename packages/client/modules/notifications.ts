import {
    NotificationPaginationResponse,
    NotificationResponse,
    NotificationUnseenResponse,
    PaginationArgs,
} from '../types';
import { BaseModule } from './base';

export class NotificationsModule extends BaseModule {
    /**
     * Get user notifications list
     */
    public async getNotificationList(
        { page, size }: PaginationArgs = { page: 1, size: 15 },
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
     * Get count of unseen notifications
     */
    public async getNotificationUnseenCount(): Promise<NotificationUnseenResponse> {
        return this.client.get<NotificationUnseenResponse>(
            '/notifications/count',
        );
    }

    /**
     * Update notification to mark as seen
     */
    public async updateNotificationSeen(
        reference: string,
    ): Promise<NotificationResponse> {
        return this.client.post<NotificationResponse>(
            `/notifications/${reference}/seen`,
        );
    }
}
