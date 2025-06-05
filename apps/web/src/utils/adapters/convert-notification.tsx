import {
    ContentTypeEnum,
    NotificationCommentData,
    NotificationCommentVoteData,
    NotificationData,
    NotificationEditData,
    NotificationFollowData,
    NotificationHikkaData,
    NotificationResponse,
    NotificationScheduleAnimeData,
    NotificationThirdpartyLoginData,
    NotificationTypeEnum,
    NotificationVoteData,
} from '@hikka/client';
import { ReactNode } from 'react';

import ContentCard from '../../components/content-card/content-card';
import FeMention from '../../components/icons/fe/FeMention';
import MaterialSymbolsAddCommentRounded from '../../components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsChangeCircleRounded from '../../components/icons/material-symbols/MaterialSymbolsChangeCircleRounded';
import MaterialSymbolsCheckCircleRounded from '../../components/icons/material-symbols/MaterialSymbolsCheckCircleRounded';
import MaterialSymbolsFavoriteRounded from '../../components/icons/material-symbols/MaterialSymbolsFavoriteRounded';
import MaterialSymbolsFlagCircleRounded from '../../components/icons/material-symbols/MaterialSymbolsFlagCircleRounded';
import MaterialSymbolsHeartMinusRounded from '../../components/icons/material-symbols/MaterialSymbolsHeartMinusRounded';
import MaterialSymbolsHeartPlusRounded from '../../components/icons/material-symbols/MaterialSymbolsHeartPlusRounded';
import MaterialSymbolsInfoRounded from '../../components/icons/material-symbols/MaterialSymbolsInfoRounded';
import MaterialSymbolsLiveTvRounded from '../../components/icons/material-symbols/MaterialSymbolsLiveTvRounded';
import MaterialSymbolsLockOpenRightOutlineRounded from '../../components/icons/material-symbols/MaterialSymbolsLockOpenRightOutlineRounded';
import MaterialSymbolsPersonAddRounded from '../../components/icons/material-symbols/MaterialSymbolsPersonAddRounded';

/**
 * Notification title mapping
 */
const NOTIFICATION_TITLES: Record<NotificationTypeEnum, string> = {
    [NotificationTypeEnum.EDIT_ACCEPTED]: 'Правка прийнята',
    [NotificationTypeEnum.EDIT_DENIED]: 'Правка відхилена',
    [NotificationTypeEnum.EDIT_UPDATED]: 'Правка оновлена',
    [NotificationTypeEnum.COMMENT_REPLY]: 'Новий коментар',
    [NotificationTypeEnum.COMMENT_VOTE]: 'Нова оцінка',
    [NotificationTypeEnum.ARTICLE_VOTE]: 'Нова оцінка',
    [NotificationTypeEnum.COMMENT_TAG]: 'Нова згадка',
    [NotificationTypeEnum.EDIT_COMMENT]: 'Новий коментар у правці',
    [NotificationTypeEnum.COLLECTION_COMMENT]: 'Новий коментар у колекції',
    [NotificationTypeEnum.HIKKA_UPDATE]: 'Hikka',
    [NotificationTypeEnum.SCHEDULE_ANIME]: 'Новий епізод',
    [NotificationTypeEnum.FOLLOW]: 'Нова підписка',
    [NotificationTypeEnum.COLLECTION_VOTE]: 'Нова оцінка у колекції',
    [NotificationTypeEnum.THIRDPARTY_LOGIN]: 'Стороння авторизація',
    [NotificationTypeEnum.ARTICLE_COMMENT]: 'Новий коментар у статті',
};

/**
 * Functions to generate description text for each notification type
 */
const NOTIFICATION_DESCRIPTIONS: Record<
    NotificationTypeEnum,
    (...args: any[]) => string | ReactNode
> = {
    [NotificationTypeEnum.EDIT_ACCEPTED]: () => 'Ваша правка була прийнята',
    [NotificationTypeEnum.EDIT_DENIED]: () => 'Ваша правка була відхилена',
    [NotificationTypeEnum.EDIT_UPDATED]: () => 'Ваша правка була оновлена',
    [NotificationTypeEnum.COMMENT_REPLY]: (username: string) =>
        `Користувач **${username}** відповів на Ваш коментар`,
    [NotificationTypeEnum.COMMENT_VOTE]: (username: string) =>
        `Користувач **${username}** оцінив Ваш коментар`,
    [NotificationTypeEnum.COMMENT_TAG]: (username: string) =>
        `Користувач **${username}** згадав Вас у коментарі`,
    [NotificationTypeEnum.EDIT_COMMENT]: (username: string) =>
        `Користувач **${username}** залишив коментар`,
    [NotificationTypeEnum.COLLECTION_COMMENT]: (username: string) =>
        `Користувач **${username}** залишив коментар`,
    [NotificationTypeEnum.HIKKA_UPDATE]: (description: string) => description,
    [NotificationTypeEnum.SCHEDULE_ANIME]: (episode: number) =>
        `Вийшов ${episode} епізод аніме`,
    [NotificationTypeEnum.FOLLOW]: (username: string) =>
        `Користувач **${username}** підписався на Ваш профіль`,
    [NotificationTypeEnum.COLLECTION_VOTE]: (username: string) =>
        `Користувач **${username}** оцінив Вашу колекцію`,
    [NotificationTypeEnum.ARTICLE_VOTE]: (username: string) =>
        `Користувач **${username}** оцінив Вашу статтю`,
    [NotificationTypeEnum.THIRDPARTY_LOGIN]: (clientName: string) =>
        `Ви авторизувались через сторонній застосунок **${clientName}**`,
    [NotificationTypeEnum.ARTICLE_COMMENT]: (username: string) =>
        `Користувач **${username}** залишив коментар`,
};

/**
 * Default icons for each notification type
 */
const NOTIFICATION_ICONS: Record<NotificationTypeEnum, ReactNode> = {
    [NotificationTypeEnum.EDIT_ACCEPTED]: <MaterialSymbolsCheckCircleRounded />,
    [NotificationTypeEnum.EDIT_DENIED]: <MaterialSymbolsFlagCircleRounded />,
    [NotificationTypeEnum.EDIT_UPDATED]: <MaterialSymbolsChangeCircleRounded />,
    [NotificationTypeEnum.COMMENT_REPLY]: <MaterialSymbolsAddCommentRounded />,
    [NotificationTypeEnum.COMMENT_VOTE]: <MaterialSymbolsFavoriteRounded />,
    [NotificationTypeEnum.COMMENT_TAG]: <FeMention />,
    [NotificationTypeEnum.EDIT_COMMENT]: <MaterialSymbolsAddCommentRounded />,
    [NotificationTypeEnum.COLLECTION_COMMENT]: (
        <MaterialSymbolsAddCommentRounded />
    ),
    [NotificationTypeEnum.HIKKA_UPDATE]: <MaterialSymbolsInfoRounded />,
    [NotificationTypeEnum.SCHEDULE_ANIME]: <MaterialSymbolsLiveTvRounded />,
    [NotificationTypeEnum.FOLLOW]: <MaterialSymbolsPersonAddRounded />,
    [NotificationTypeEnum.COLLECTION_VOTE]: <MaterialSymbolsFavoriteRounded />,
    [NotificationTypeEnum.THIRDPARTY_LOGIN]: (
        <MaterialSymbolsLockOpenRightOutlineRounded />
    ),
    [NotificationTypeEnum.ARTICLE_COMMENT]: (
        <MaterialSymbolsAddCommentRounded />
    ),
    [NotificationTypeEnum.ARTICLE_VOTE]: <MaterialSymbolsFavoriteRounded />,
};

/**
 * Generates a comment link based on content type and references
 *
 * @param contentType - Type of content the comment belongs to
 * @param slug - Content slug
 * @param commentReference - Comment reference ID
 * @returns URL string for the comment
 */
const getCommentLink = (
    contentType: ContentTypeEnum,
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
    notification: NotificationResponse<NotificationData>,
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
        notification: NotificationResponse<NotificationCommentData>,
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
        notification: NotificationResponse<NotificationVoteData>,
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
        notification: NotificationResponse<NotificationCommentVoteData>,
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
        notification: NotificationResponse<NotificationVoteData>,
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
        notification: NotificationResponse<NotificationCommentData>,
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
        notification: NotificationResponse<NotificationCommentData>,
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
        notification: NotificationResponse<NotificationEditData>,
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
        notification: NotificationResponse<NotificationHikkaData>,
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
        notification: NotificationResponse<NotificationScheduleAnimeData>,
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
        notification: NotificationResponse<NotificationFollowData>,
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
        notification: NotificationResponse<NotificationThirdpartyLoginData>,
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
    notification: NotificationResponse<NotificationData>,
): Hikka.TextNotification | null => {
    const type = notification.notification_type;

    switch (type) {
        case NotificationTypeEnum.COMMENT_REPLY:
            return notificationHandlers.comment_reply(
                notification as NotificationResponse<NotificationCommentData>,
            );

        case NotificationTypeEnum.ARTICLE_VOTE:
            return notificationHandlers.article_vote(
                notification as NotificationResponse<NotificationVoteData>,
            );

        case NotificationTypeEnum.COMMENT_VOTE:
            return notificationHandlers.comment_vote(
                notification as NotificationResponse<NotificationCommentVoteData>,
            );

        case NotificationTypeEnum.COLLECTION_VOTE:
            return notificationHandlers.collection_vote(
                notification as NotificationResponse<NotificationVoteData>,
            );

        case NotificationTypeEnum.COMMENT_TAG:
            return notificationHandlers.comment_tag(
                notification as NotificationResponse<NotificationCommentData>,
            );

        case NotificationTypeEnum.EDIT_COMMENT:
        case NotificationTypeEnum.COLLECTION_COMMENT:
        case NotificationTypeEnum.ARTICLE_COMMENT:
            return notificationHandlers.handleGenericComment(
                notification as NotificationResponse<NotificationCommentData>,
                type,
            );

        case NotificationTypeEnum.EDIT_ACCEPTED:
        case NotificationTypeEnum.EDIT_DENIED:
        case NotificationTypeEnum.EDIT_UPDATED:
            return notificationHandlers.handleEditAction(
                notification as NotificationResponse<NotificationEditData>,
                type,
            );

        case NotificationTypeEnum.HIKKA_UPDATE:
            return notificationHandlers.hikka_update(
                notification as NotificationResponse<NotificationHikkaData>,
            );

        case NotificationTypeEnum.SCHEDULE_ANIME:
            return notificationHandlers.schedule_anime(
                notification as NotificationResponse<NotificationScheduleAnimeData>,
            );

        case NotificationTypeEnum.FOLLOW:
            return notificationHandlers.follow(
                notification as NotificationResponse<NotificationFollowData>,
            );

        case NotificationTypeEnum.THIRDPARTY_LOGIN:
            return notificationHandlers.thirdparty_login(
                notification as NotificationResponse<NotificationThirdpartyLoginData>,
            );

        default:
            return null;
    }
};
