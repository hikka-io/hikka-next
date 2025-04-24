import {
    ContentStatusEnum,
    ContentTypeEnum,
    PaginatedResponse,
    PaginationResponse,
} from './common';
import { UserResponse } from './user';

/**
 * Notification response
 */
export interface NotificationResponse<TData = NotificationData> {
    initiator_user: UserResponse | null;
    notification_type: NotificationTypeEnum;
    created: number;
    reference: string;
    seen: boolean;
    data: TData;
}

/**
 * Notifications response
 */
export interface NotificationsListResponse
    extends PaginatedResponse<NotificationResponse> {}

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

export enum NotificationTypeEnum {
    COMMENT_REPLY = 'comment_reply',
    COMMENT_VOTE = 'comment_vote',
    ARTICLE_VOTE = 'article_vote',
    COMMENT_TAG = 'comment_tag',
    EDIT_COMMENT = 'edit_comment',
    COLLECTION_COMMENT = 'collection_comment',
    ARTICLE_COMMENT = 'article_comment',
    EDIT_ACCEPTED = 'edit_accepted',
    EDIT_DENIED = 'edit_denied',
    EDIT_UPDATED = 'edit_updated',
    HIKKA_UPDATE = 'hikka_update',
    SCHEDULE_ANIME = 'schedule_anime',
    FOLLOW = 'follow',
    COLLECTION_VOTE = 'collection_vote',
    THIRDPARTY_LOGIN = 'thirdparty_login',
}

/**
 * Notification follow data
 */
export interface NotificationFollowData {
    username: string;
    avatar: string;
}

/**
 * Notification thirdparty login data
 */
export interface NotificationThirdpartyLoginData {
    scope: string[];
    client: {
        name: string;
        reference: string;
        description: string;
    };
}

/**
 * Notification comment data
 */
export interface NotificationCommentData {
    slug: string;
    comment_text: string;
    content_type: ContentTypeEnum;
    comment_depth: number;
    comment_reference: string;
    base_comment_reference: string;
    username: string;
    avatar: string;
}

/**
 * Notification vote data
 */
export interface NotificationVoteData {
    slug: string;
    user_score: number;
    old_score: number;
    new_score: number;
    username: string;
    avatar: string;
}

/**
 * Notification comment vote data
 */
export interface NotificationCommentVoteData extends NotificationVoteData {
    content_type: ContentTypeEnum;
    comment_reference: string;
    comment_depth: number;
    comment_text: string;
    base_comment_reference: string;
}

/**
 * Notification edit data
 */
export interface NotificationEditData {
    description: string;
    edit_id: number;
}

/**
 * Notification hikka data
 */
export interface NotificationHikkaData {
    description: string;
    title: string;
    link: string;
}

/**
 * Notification schedule anime data
 */
export interface NotificationScheduleAnimeData {
    slug: string;
    after: {
        status: ContentStatusEnum;
        episodes_released: number;
    };
    before: {
        status: ContentStatusEnum;
        episodes_released: number;
    };
    image: string;
    title_en: string;
    title_ja: string;
    title_ua: string;
}

export type NotificationData =
    | NotificationCommentVoteData
    | NotificationCommentData
    | NotificationEditData
    | NotificationHikkaData
    | NotificationScheduleAnimeData
    | NotificationFollowData
    | NotificationVoteData
    | NotificationThirdpartyLoginData;
