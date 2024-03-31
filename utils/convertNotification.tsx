import { ReactNode } from 'react';
import FeMention from '~icons/fe/mention';
import MaterialSymbolsAddCommentRounded from '~icons/material-symbols/add-comment-rounded';
import MaterialSymbolsChangeCircleRounded from '~icons/material-symbols/change-circle-rounded';
import MaterialSymbolsCheckCircleRounded from '~icons/material-symbols/check-circle-rounded';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';
import MaterialSymbolsFlagCircleRounded from '~icons/material-symbols/flag-circle-rounded';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';
import MaterialSymbolsLiveTvRounded from '~icons/material-symbols/live-tv-rounded';
import MaterialSymbolsPersonAddRounded from '~icons/material-symbols/person-add-rounded'

import EntryCard from '@/components/entry-card/entry-card';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';

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
    follow: 'Нова підписка'
};

const DESCRIPTIONS: Record<
    API.NotificationType,
    (...args: any) => string | ReactNode
> = {
    edit_accepted: () => 'Ваша правка була прийнята',
    edit_denied: () => 'Ваша правка була відхилена',
    edit_updated: () => 'Ваша правка була оновлена',
    comment_reply: (comment_author: string) => (
        <>
            <span className="font-bold">@{comment_author}</span> відповів на Ваш
            коментар
        </>
    ),
    comment_vote: (username: string) => <>Ваш коментар оцінили</>,
    comment_tag: (comment_author: string) => (
        <>
            <span className="font-bold">@{comment_author}</span> згадав Вас у
            коментарі
        </>
    ),
    edit_comment: (comment_author: string) => (
        <>
            <span className="font-bold">@{comment_author}</span> залишив
            коментар
        </>
    ),
    collection_comment: (comment_author: string) => (
        <>
            <span className="font-bold">@{comment_author}</span> залишив
            коментар
        </>
    ),
    hikka_update: (description: string) => description,
    schedule_anime: (episode: number) => (
        <>
            Вийшов <span className="font-bold">{episode}</span> епізод аніме
        </>
    ),
    follow: (username: string) => (
        <>
            <span className="font-bold">@{username}</span> підписався на ваш профіль
        </>
    ),
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
};

const getInitialData = (
    notification: API.Notification<
        | API.NotificationCommentData
        | API.NotificationCommentVoteData
        | API.NotificationEditData
        | API.NotificationHikkaData
        | API.NotificationScheduleAnimeData
        | API.NotificationFollowData
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
    const { comment_author, slug, content_type, comment_reference } =
        notification.data;

    return {
        ...getInitialData(notification),
        description:
            DESCRIPTIONS[notification.notification_type](comment_author),
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}#${comment_reference}`,
    };
};

const commentVote = (
    notification: API.Notification<API.NotificationCommentVoteData>,
): Hikka.TextNotification => {
    const { slug, content_type, comment_reference } = notification.data;

    return {
        ...getInitialData(notification),
        description: DESCRIPTIONS[notification.notification_type](''),
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}#${comment_reference}`,
    };
};

const commentTag = (
    notification: API.Notification<API.NotificationCommentData>,
): Hikka.TextNotification => {
    const { comment_author, slug, content_type, comment_reference } =
        notification.data;

    return {
        ...getInitialData(notification),
        description:
            DESCRIPTIONS[notification.notification_type](comment_author),
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}#${comment_reference}`,
    };
};

const editComment = (
    notification: API.Notification<API.NotificationCommentData>,
): Hikka.TextNotification => {
    const { comment_author, slug, content_type, comment_reference } =
        notification.data;

    return {
        ...getInitialData(notification),
        description:
            DESCRIPTIONS[notification.notification_type](comment_author),
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}#${comment_reference}`,
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
        poster: (
            <EntryCard
                containerRatio={1}
                className="w-10"
                poster={notification.data.poster}
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
        poster: (
            <EntryCard
                containerRatio={1}
                className="w-10"
                poster={avatar}
            />
        ),
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
    }
};
