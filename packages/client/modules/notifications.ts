import { DEFAULT_PAGINATION } from '../constants';
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
    public async getNotificationList({
        page,
        size,
    }: PaginationArgs): Promise<NotificationPaginationResponse> {
        return this.client.get<NotificationPaginationResponse>(
            '/notifications',
            {
                ...DEFAULT_PAGINATION,
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
