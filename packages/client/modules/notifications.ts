import { DEFAULT_PAGINATION } from '../constants';
import {
    BaseRequestOptionsArgs,
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
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<NotificationPaginationResponse> {
        return this.client.get<NotificationPaginationResponse>(
            '/notifications',
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get count of unseen notifications
     */
    public async getNotificationUnseenCount(
        options?: BaseRequestOptionsArgs,
    ): Promise<NotificationUnseenResponse> {
        return this.client.get<NotificationUnseenResponse>(
            '/notifications/count',
            options,
        );
    }

    /**
     * Update notification to mark as seen
     */
    public async updateNotificationSeen(
        reference: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<NotificationResponse> {
        return this.client.post<NotificationResponse>(
            `/notifications/${reference}/seen`,
            undefined,
            options,
        );
    }
}
