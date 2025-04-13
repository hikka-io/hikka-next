import { ReactNode } from 'react';

import ContentCard from '@/components/content-card/content-card';
import FeMention from '@/components/icons/fe/FeMention';
import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsChangeCircleRounded from '@/components/icons/material-symbols/MaterialSymbolsChangeCircleRounded';
import MaterialSymbolsCheckCircleRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckCircleRounded';
import MaterialSymbolsFavoriteRounded from '@/components/icons/material-symbols/MaterialSymbolsFavoriteRounded';
import MaterialSymbolsFlagCircleRounded from '@/components/icons/material-symbols/MaterialSymbolsFlagCircleRounded';
import MaterialSymbolsHeartMinusRounded from '@/components/icons/material-symbols/MaterialSymbolsHeartMinusRounded';
import MaterialSymbolsHeartPlusRounded from '@/components/icons/material-symbols/MaterialSymbolsHeartPlusRounded';
import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import MaterialSymbolsLiveTvRounded from '@/components/icons/material-symbols/MaterialSymbolsLiveTvRounded';
import MaterialSymbolsLockOpenRightOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsLockOpenRightOutlineRounded';
import MaterialSymbolsPersonAddRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonAddRounded';

/**
 * Notification title mapping
 */
const NOTIFICATION_TITLES: Record<API.NotificationType, string> = {
    edit_accepted: 'Правка прийнята',
    edit_denied: 'Правка відхилена',
    edit_updated: 'Правка оновлена',
    comment_reply: 'Новий коментар',
    comment_vote: 'Нова оцінка',
    article_vote: 'Нова оцінка',
    comment_tag: 'Нова згадка',
    edit_comment: 'Новий коментар у правці',
    collection_comment: 'Новий коментар у колекції',
    hikka_update: 'Hikka',
    schedule_anime: 'Новий епізод',
    follow: 'Нова підписка',
    collection_vote: 'Нова оцінка у колекції',
    thirdparty_login: 'Стороння авторизація',
    article_comment: 'Новий коментар у статті',
};

/**
 * Functions to generate description text for each notification type
 */
const NOTIFICATION_DESCRIPTIONS: Record<
    API.NotificationType,
    (...args: any[]) => string | ReactNode
> = {
    edit_accepted: () => 'Ваша правка була прийнята',
    edit_denied: () => 'Ваша правка була відхилена',
    edit_updated: () => 'Ваша правка була оновлена',
    comment_reply: (username: string) =>
        `Користувач **${username}** відповів на Ваш коментар`,
    comment_vote: (username: string) =>
        `Користувач **${username}** оцінив Ваш коментар`,
    comment_tag: (username: string) =>
        `Користувач **${username}** згадав Вас у коментарі`,
    edit_comment: (username: string) =>
        `Користувач **${username}** залишив коментар`,
    collection_comment: (username: string) =>
        `Користувач **${username}** залишив коментар`,
    hikka_update: (description: string) => description,
    schedule_anime: (episode: number) => `Вийшов ${episode} епізод аніме`,
    follow: (username: string) =>
        `Користувач **${username}** підписався на Ваш профіль`,
    collection_vote: (username: string) =>
        `Користувач **${username}** оцінив Вашу колекцію`,
    article_vote: (username: string) =>
        `Користувач **${username}** оцінив Вашу статтю`,
    thirdparty_login: (clientName: string) =>
        `Ви авторизувались через сторонній застосунок **${clientName}**`,
    article_comment: (username: string) =>
        `Користувач **${username}** залишив коментар`,
};

/**
 * Default icons for each notification type
 */
const NOTIFICATION_ICONS: Record<API.NotificationType, ReactNode> = {
    edit_accepted: <MaterialSymbolsCheckCircleRounded />,
    edit_denied: <MaterialSymbolsFlagCircleRounded />,
    edit_updated: <MaterialSymbolsChangeCircleRounded />,
    comment_reply: <MaterialSymbolsAddCommentRounded />,
    comment_vote: <MaterialSymbolsFavoriteRounded />,
    comment_tag: <FeMention />,
    edit_comment: <MaterialSymbolsAddCommentRounded />,
    collection_comment: <MaterialSymbolsAddCommentRounded />,
    hikka_update: <MaterialSymbolsInfoRounded />,
    schedule_anime: <MaterialSymbolsLiveTvRounded />,
    follow: <MaterialSymbolsPersonAddRounded />,
    collection_vote: <MaterialSymbolsFavoriteRounded />,
    thirdparty_login: <MaterialSymbolsLockOpenRightOutlineRounded />,
    article_comment: <MaterialSymbolsAddCommentRounded />,
    article_vote: <MaterialSymbolsFavoriteRounded />,
};

/**
 * Type for all supported notification data types
 */
type SupportedNotificationData =
    | API.NotificationCommentVoteData
    | API.NotificationCommentData
    | API.NotificationEditData
    | API.NotificationHikkaData
    | API.NotificationScheduleAnimeData
    | API.NotificationFollowData
    | API.NotificationVoteData
    | API.NotificationThirdpartyLoginData;

/**
 * Generates a comment link based on content type and references
 *
 * @param contentType - Type of content the comment belongs to
 * @param slug - Content slug
 * @param commentReference - Comment reference ID
 * @returns URL string for the comment
 */
const getCommentLink = (
    contentType: API.ContentType,
    slug: string,
    commentReference: string,
): string => {
    return `/comments/${contentType}/${slug}/${commentReference}`;
};

/**
 * Creates a user avatar component
 *
 * @param avatar - Avatar image URL
 * @returns React component for the avatar
 */
const createAvatarImage = (avatar?: string) => (
    <ContentCard containerRatio={1} className="w-10" image={avatar} />
);

/**
 * Extracts common initial data from any notification
 *
 * @param notification - Notification object
 * @returns Base notification data
 */
const getInitialData = (
    notification: API.Notification<SupportedNotificationData>,
): Pick<
    Hikka.TextNotification,
    'icon' | 'type' | 'title' | 'reference' | 'created' | 'seen'
> => {
    return {
        icon: NOTIFICATION_ICONS[notification.notification_type],
        type: notification.notification_type,
        title: NOTIFICATION_TITLES[notification.notification_type],
        reference: notification.reference,
        created: notification.created,
        seen: notification.seen,
    };
};

/**
 * Gets the appropriate icon for vote notifications based on score
 *
 * @param score - The vote score
 * @returns React component for the appropriate icon
 */
const getVoteIcon = (score: number): ReactNode => {
    return score > 0 ? (
        <MaterialSymbolsHeartPlusRounded />
    ) : (
        <MaterialSymbolsHeartMinusRounded />
    );
};

/**
 * Creates vote-related notification title with score
 *
 * @param baseTitle - Base title text
 * @param score - Vote score
 * @returns Formatted title with score
 */
const createVoteTitle = (baseTitle: string, score: number): string => {
    return `${baseTitle} (${score > 0 ? '+' : ''}${score})`;
};

/**
 * Handlers for each notification type
 */
const notificationHandlers = {
    /**
     * Handles comment reply notifications
     */
    comment_reply: (
        notification: API.Notification<API.NotificationCommentData>,
    ): Hikka.TextNotification => {
        const { username, slug, content_type, base_comment_reference, avatar } =
            notification.data;

        return {
            ...getInitialData(notification),
            description: NOTIFICATION_DESCRIPTIONS.comment_reply(username),
            href: getCommentLink(content_type, slug, base_comment_reference),
            image: createAvatarImage(avatar),
        };
    },

    /**
     * Handles article vote notifications
     */
    article_vote: (
        notification: API.Notification<API.NotificationVoteData>,
    ): Hikka.TextNotification => {
        const { slug, username, avatar, user_score } = notification.data;

        return {
            ...getInitialData(notification),
            title: createVoteTitle(
                NOTIFICATION_TITLES.article_vote,
                user_score,
            ),
            icon: getVoteIcon(user_score),
            description: NOTIFICATION_DESCRIPTIONS.article_vote(username),
            href: `/articles/${slug}`,
            image: createAvatarImage(avatar),
        };
    },

    /**
     * Handles comment vote notifications
     */
    comment_vote: (
        notification: API.Notification<API.NotificationCommentVoteData>,
    ): Hikka.TextNotification => {
        const {
            slug,
            content_type,
            base_comment_reference,
            username,
            avatar,
            user_score,
        } = notification.data;

        return {
            ...getInitialData(notification),
            title: createVoteTitle(
                NOTIFICATION_TITLES.comment_vote,
                user_score,
            ),
            icon: getVoteIcon(user_score),
            description: NOTIFICATION_DESCRIPTIONS.comment_vote(username),
            href: getCommentLink(content_type, slug, base_comment_reference),
            image: createAvatarImage(avatar),
        };
    },

    /**
     * Handles collection vote notifications
     */
    collection_vote: (
        notification: API.Notification<API.NotificationVoteData>,
    ): Hikka.TextNotification => {
        const { slug, username, avatar, user_score } = notification.data;

        return {
            ...getInitialData(notification),
            title: createVoteTitle(
                NOTIFICATION_TITLES.collection_vote,
                user_score,
            ),
            icon: getVoteIcon(user_score),
            description: NOTIFICATION_DESCRIPTIONS.collection_vote(username),
            href: `/collections/${slug}`,
            image: createAvatarImage(avatar),
        };
    },

    /**
     * Handles comment tag notifications
     */
    comment_tag: (
        notification: API.Notification<API.NotificationCommentData>,
    ): Hikka.TextNotification => {
        const { username, slug, content_type, base_comment_reference, avatar } =
            notification.data;

        return {
            ...getInitialData(notification),
            description: NOTIFICATION_DESCRIPTIONS.comment_tag(username),
            href: getCommentLink(content_type, slug, base_comment_reference),
            image: createAvatarImage(avatar),
        };
    },

    /**
     * Generic handler for comment notifications on different content types
     */
    handleGenericComment: (
        notification: API.Notification<API.NotificationCommentData>,
        type: 'edit_comment' | 'collection_comment' | 'article_comment',
    ): Hikka.TextNotification => {
        const { username, slug, content_type, base_comment_reference, avatar } =
            notification.data;

        return {
            ...getInitialData(notification),
            description: NOTIFICATION_DESCRIPTIONS[type](username),
            href: getCommentLink(content_type, slug, base_comment_reference),
            image: createAvatarImage(avatar),
        };
    },

    /**
     * Generic handler for edit action notifications
     */
    handleEditAction: (
        notification: API.Notification<API.NotificationEditData>,
        type: 'edit_accepted' | 'edit_denied' | 'edit_updated',
    ): Hikka.TextNotification => {
        const { edit_id } = notification.data;

        return {
            ...getInitialData(notification),
            description: NOTIFICATION_DESCRIPTIONS[type](),
            href: `/edit/${edit_id}`,
        };
    },

    /**
     * Handles Hikka update notifications
     */
    hikka_update: (
        notification: API.Notification<API.NotificationHikkaData>,
    ): Hikka.TextNotification => {
        return {
            ...getInitialData(notification),
            title: notification.data.title || NOTIFICATION_TITLES.hikka_update,
            description: NOTIFICATION_DESCRIPTIONS.hikka_update(
                notification.data.description,
            ),
            href: notification.data.link,
        };
    },

    /**
     * Handles anime schedule notifications
     */
    schedule_anime: (
        notification: API.Notification<API.NotificationScheduleAnimeData>,
    ): Hikka.TextNotification => {
        const { title_ua, title_en, title_ja, slug, image, after } =
            notification.data;

        return {
            ...getInitialData(notification),
            title: title_ua || title_en || title_ja,
            description: NOTIFICATION_DESCRIPTIONS.schedule_anime(
                after.episodes_released,
            ),
            href: `/anime/${slug}`,
            image: createAvatarImage(image),
        };
    },

    /**
     * Handles follow notifications
     */
    follow: (
        notification: API.Notification<API.NotificationFollowData>,
    ): Hikka.TextNotification => {
        const { username, avatar } = notification.data;

        return {
            ...getInitialData(notification),
            description: NOTIFICATION_DESCRIPTIONS.follow(username),
            href: `/u/${username}`,
            image: createAvatarImage(avatar),
        };
    },

    /**
     * Handles third-party login notifications
     */
    thirdparty_login: (
        notification: API.Notification<API.NotificationThirdpartyLoginData>,
    ): Hikka.TextNotification => {
        const { client } = notification.data;

        return {
            ...getInitialData(notification),
            description: NOTIFICATION_DESCRIPTIONS.thirdparty_login(
                client.name,
            ),
            href: `#`,
        };
    },
};

/**
 * Converts API notification object to application's TextNotification format
 *
 * @param notification - Raw API notification object
 * @returns Formatted TextNotification ready for display
 */
export const convertNotification = (
    notification: API.Notification<SupportedNotificationData>,
): Hikka.TextNotification => {
    const type = notification.notification_type;

    switch (type) {
        case 'comment_reply':
            return notificationHandlers.comment_reply(
                notification as API.Notification<API.NotificationCommentData>,
            );

        case 'article_vote':
            return notificationHandlers.article_vote(
                notification as API.Notification<API.NotificationVoteData>,
            );

        case 'comment_vote':
            return notificationHandlers.comment_vote(
                notification as API.Notification<API.NotificationCommentVoteData>,
            );

        case 'collection_vote':
            return notificationHandlers.collection_vote(
                notification as API.Notification<API.NotificationVoteData>,
            );

        case 'comment_tag':
            return notificationHandlers.comment_tag(
                notification as API.Notification<API.NotificationCommentData>,
            );

        case 'edit_comment':
        case 'collection_comment':
        case 'article_comment':
            return notificationHandlers.handleGenericComment(
                notification as API.Notification<API.NotificationCommentData>,
                type,
            );

        case 'edit_accepted':
        case 'edit_denied':
        case 'edit_updated':
            return notificationHandlers.handleEditAction(
                notification as API.Notification<API.NotificationEditData>,
                type,
            );

        case 'hikka_update':
            return notificationHandlers.hikka_update(
                notification as API.Notification<API.NotificationHikkaData>,
            );

        case 'schedule_anime':
            return notificationHandlers.schedule_anime(
                notification as API.Notification<API.NotificationScheduleAnimeData>,
            );

        case 'follow':
            return notificationHandlers.follow(
                notification as API.Notification<API.NotificationFollowData>,
            );

        case 'thirdparty_login':
            return notificationHandlers.thirdparty_login(
                notification as API.Notification<API.NotificationThirdpartyLoginData>,
            );
    }
};
