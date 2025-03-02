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

const TITLES: Record<API.NotificationType, string> = {
    edit_accepted: 'Правка прийнята',
    edit_denied: 'Правка відхилена',
    edit_updated: 'Правка оновлена',
    comment_reply: 'Новий коментар',
    comment_vote: 'Нова оцінка',
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

const DESCRIPTIONS: Record<
    API.NotificationType,
    (...args: any) => string | ReactNode
> = {
    edit_accepted: () => 'Ваша правка була прийнята',
    edit_denied: () => 'Ваша правка була відхилена',
    edit_updated: () => 'Ваша правка була оновлена',
    comment_reply: (comment_author: string) =>
        `Користувач **${comment_author}** відповів на Ваш коментар`,
    comment_vote: (username: string) =>
        `Користувач **${username}** оцінив Ваш коментар`,
    comment_tag: (comment_author: string) =>
        `Користувач **${comment_author}** згадав Вас у коментарі`,
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
    thirdparty_login: (client_name: string) =>
        `Ви авторизувались через сторонній застосунок **${client_name}**`,
    article_comment: (username: string) =>
        `Користувач **${username}** залишив коментар`,
};

const ICONS: Record<API.NotificationType, ReactNode> = {
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
};

const getCommentLink = (
    content_type: API.ContentType,
    slug: string,
    comment_reference: string,
) => {
    return `/comments/${content_type}/${slug}/${comment_reference}`;
};

const getInitialData = (
    notification: API.Notification<
        | API.NotificationCommentData
        | API.NotificationCommentVoteData
        | API.NotificationEditData
        | API.NotificationHikkaData
        | API.NotificationScheduleAnimeData
        | API.NotificationFollowData
        | API.NotificationThirdpartyLoginData
    >,
) => {
    return {
        icon: ICONS[notification.notification_type],
        type: notification.notification_type,
        title: TITLES[notification.notification_type],
        reference: notification.reference,
        created: notification.created,
        seen: notification.seen,
    };
};

const commentReply = (
    notification: API.Notification<API.NotificationCommentData>,
): Hikka.TextNotification => {
    const { username, slug, content_type, base_comment_reference, avatar } =
        notification.data;

    return {
        ...getInitialData(notification),
        description: DESCRIPTIONS[notification.notification_type](username),
        href: getCommentLink(content_type, slug, base_comment_reference),
        image: (
            <ContentCard containerRatio={1} className="w-10" image={avatar} />
        ),
    };
};

const commentVote = (
    notification: API.Notification<API.NotificationCommentVoteData>,
): Hikka.TextNotification => {
    const {
        slug,
        content_type,
        comment_reference,
        base_comment_reference,
        username,
        avatar,
        user_score,
    } = notification.data;

    return {
        ...getInitialData(notification),
        title: `${TITLES[notification.notification_type]} (${user_score > 0 ? '+' : ''}${user_score})`,
        icon:
            user_score > 0 ? (
                <MaterialSymbolsHeartPlusRounded />
            ) : (
                <MaterialSymbolsHeartMinusRounded />
            ),
        description: DESCRIPTIONS[notification.notification_type](username),
        href: getCommentLink(content_type, slug, base_comment_reference),
        image: (
            <ContentCard containerRatio={1} className="w-10" image={avatar} />
        ),
    };
};

const commentTag = (
    notification: API.Notification<API.NotificationCommentData>,
): Hikka.TextNotification => {
    const { username, slug, content_type, base_comment_reference, avatar } =
        notification.data;

    return {
        ...getInitialData(notification),
        description: DESCRIPTIONS[notification.notification_type](username),
        href: getCommentLink(content_type, slug, base_comment_reference),
        image: (
            <ContentCard containerRatio={1} className="w-10" image={avatar} />
        ),
    };
};

const editComment = (
    notification: API.Notification<API.NotificationCommentData>,
): Hikka.TextNotification => {
    const { username, slug, content_type, base_comment_reference, avatar } =
        notification.data;

    return {
        ...getInitialData(notification),
        description: DESCRIPTIONS[notification.notification_type](username),
        href: getCommentLink(content_type, slug, base_comment_reference),
        image: (
            <ContentCard containerRatio={1} className="w-10" image={avatar} />
        ),
    };
};

const editActions = (
    notification: API.Notification<API.NotificationEditData>,
): Hikka.TextNotification => {
    const { edit_id } = notification.data;

    return {
        ...getInitialData(notification),
        description: DESCRIPTIONS[notification.notification_type](),
        href: `/edit/${edit_id}`,
    };
};

const hikkaUpdate = (
    notification: API.Notification<API.NotificationHikkaData>,
) => {
    return {
        ...getInitialData(notification),
        title:
            notification.data.title || TITLES[notification.notification_type],
        description: DESCRIPTIONS[notification.notification_type](
            notification.data.description,
        ),
        href: notification.data.link,
    };
};

const scheduleAnime = (
    notification: API.Notification<API.NotificationScheduleAnimeData>,
) => {
    return {
        ...getInitialData(notification),
        title:
            notification.data.title_ua ||
            notification.data.title_en ||
            notification.data.title_ja,
        description: DESCRIPTIONS[notification.notification_type](
            notification.data.after.episodes_released,
        ),
        href: `/anime/${notification.data.slug}`,
        image: (
            <ContentCard
                containerRatio={1}
                className="w-10"
                image={notification.data.image}
            />
        ),
    };
};

const follow = (
    notification: API.Notification<API.NotificationFollowData>,
): Hikka.TextNotification => {
    const { username, avatar } = notification.data;

    return {
        ...getInitialData(notification),
        description: DESCRIPTIONS[notification.notification_type](username),
        href: `/u/${username}`,
        image: (
            <ContentCard containerRatio={1} className="w-10" image={avatar} />
        ),
    };
};

const collectionVote = (
    notification: API.Notification<API.NotificationVoteData>,
): Hikka.TextNotification => {
    const { slug, username, avatar, user_score } = notification.data;

    return {
        ...getInitialData(notification),
        title: `${TITLES[notification.notification_type]} (${user_score > 0 ? '+' : ''}${user_score})`,
        icon:
            user_score > 0 ? (
                <MaterialSymbolsHeartPlusRounded />
            ) : (
                <MaterialSymbolsHeartMinusRounded />
            ),
        description: DESCRIPTIONS[notification.notification_type](username),
        href: `/collections/${slug}`,
        image: (
            <ContentCard containerRatio={1} className="w-10" image={avatar} />
        ),
    };
};

const thirdpartyLogin = (
    notification: API.Notification<API.NotificationThirdpartyLoginData>,
): Hikka.TextNotification => {
    const { client } = notification.data;

    return {
        ...getInitialData(notification),
        description: DESCRIPTIONS[notification.notification_type](client.name),
        href: `#`,
    };
};

export const convertNotification = (
    notification: API.Notification<
        | API.NotificationCommentVoteData
        | API.NotificationCommentData
        | API.NotificationEditData
        | API.NotificationHikkaData
        | API.NotificationScheduleAnimeData
        | API.NotificationFollowData
        | API.NotificationVoteData
        | API.NotificationThirdpartyLoginData
    >,
): Hikka.TextNotification => {
    switch (notification.notification_type) {
        case 'comment_reply':
            return commentReply(
                notification as API.Notification<API.NotificationCommentData>,
            );
        case 'comment_vote':
            return commentVote(
                notification as API.Notification<API.NotificationCommentVoteData>,
            );
        case 'collection_vote':
            return collectionVote(
                notification as API.Notification<API.NotificationVoteData>,
            );
        case 'comment_tag':
            return commentTag(
                notification as API.Notification<API.NotificationCommentData>,
            );
        case 'edit_comment':
            return editComment(
                notification as API.Notification<API.NotificationCommentData>,
            );
        case 'collection_comment':
            return editComment(
                notification as API.Notification<API.NotificationCommentData>,
            );
        case 'article_comment':
            return editComment(
                notification as API.Notification<API.NotificationCommentData>,
            );
        case 'edit_accepted':
            return editActions(
                notification as API.Notification<API.NotificationEditData>,
            );
        case 'edit_denied':
            return editActions(
                notification as API.Notification<API.NotificationEditData>,
            );
        case 'edit_updated':
            return editActions(
                notification as API.Notification<API.NotificationEditData>,
            );
        case 'hikka_update':
            return hikkaUpdate(
                notification as API.Notification<API.NotificationHikkaData>,
            );
        case 'schedule_anime':
            return scheduleAnime(
                notification as API.Notification<API.NotificationScheduleAnimeData>,
            );
        case 'follow':
            return follow(
                notification as API.Notification<API.NotificationFollowData>,
            );
        case 'thirdparty_login':
            return thirdpartyLogin(
                notification as API.Notification<API.NotificationThirdpartyLoginData>,
            );
    }
};
