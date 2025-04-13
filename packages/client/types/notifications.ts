import { PaginationResponse } from './common';
import { UserResponse } from './user';

/**
 * Notification response
 */
export interface NotificationResponse {
    initiator_user: UserResponse | null;
    notification_type: string;
    created: number;
    reference: string;
    seen: boolean;
    data: any;
}

/**
 * Paginated notifications response
 */
export interface NotificationPaginationResponse {
    pagination: PaginationResponse;
    list: NotificationResponse[];
}

/**
 * Unseen notifications count response
 */
export interface NotificationUnseenResponse {
    unseen: number;
}

/**
 * Ignored notifications types request
 */
export interface IgnoredNotificationsArgs {
    ignored_notifications: string[];
}

/**
 * Ignored notifications types response
 */
export interface IgnoredNotificationsResponse {
    ignored_notifications: string[];
}
