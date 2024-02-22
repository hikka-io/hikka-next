import { ReactNode } from 'react';
import FeMention from '~icons/fe/mention';
import MaterialSymbolsAddCommentRounded from '~icons/material-symbols/add-comment-rounded';
import MaterialSymbolsChangeCircleRounded from '~icons/material-symbols/change-circle-rounded';
import MaterialSymbolsCheckCircleRounded from '~icons/material-symbols/check-circle-rounded';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';
import MaterialSymbolsFlagCircleRounded from '~icons/material-symbols/flag-circle-rounded';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import { CONTENT_TYPE_LINKS } from '@/utils/constants';

const TITLES: Record<Hikka.NotificationType, string> = {
    edit_accepted: 'Правка прийнята',
    edit_denied: 'Правка відхилена',
    edit_updated: 'Правка оновлена',
    comment_reply: 'Новий коментар',
    comment_vote: 'Нова оцінка',
    comment_tag: 'Нова згадка',
    edit_comment: 'Новий коментар у правці',
    hikka_update: 'Hikka',
};

const DESCRIPTIONS: Record<
    Hikka.NotificationType,
    (args?: any) => string | ReactNode
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
    comment_vote: () => 'Ваш коментар оцінили',
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
    hikka_update: (description: string) => description,
};

const ICONS: Record<Hikka.NotificationType, ReactNode> = {
    edit_accepted: <MaterialSymbolsCheckCircleRounded />,
    edit_denied: <MaterialSymbolsFlagCircleRounded />,
    edit_updated: <MaterialSymbolsChangeCircleRounded />,
    comment_reply: <MaterialSymbolsAddCommentRounded />,
    comment_vote: <MaterialSymbolsFavoriteRounded />,
    comment_tag: <FeMention />,
    edit_comment: <MaterialSymbolsAddCommentRounded />,
    hikka_update: <MaterialSymbolsInfoRounded />,
};

const getInitialData = (
    notification: Hikka.Notification<
        | Hikka.NotificationCommentData
        | Hikka.NotificationCommentVoteData
        | Hikka.NotificationEditData
        | Hikka.NotificationHikkaData
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
    notification: Hikka.Notification<Hikka.NotificationCommentData>,
): Hikka.TextNotification => {
    const { comment_author, slug, content_type } = notification.data;

    return {
        ...getInitialData(notification),
        description:
            DESCRIPTIONS[notification.notification_type](comment_author),
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}`,
    };
};

const commentVote = (
    notification: Hikka.Notification<Hikka.NotificationCommentVoteData>,
): Hikka.TextNotification => {
    const { slug, content_type } = notification.data;

    return {
        ...getInitialData(notification),
        description: DESCRIPTIONS[notification.notification_type](),
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}`,
    };
};

const commentTag = (
    notification: Hikka.Notification<Hikka.NotificationCommentData>,
): Hikka.TextNotification => {
    const { comment_author, slug, content_type } = notification.data;

    return {
        ...getInitialData(notification),
        description:
            DESCRIPTIONS[notification.notification_type](comment_author),
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}`,
    };
};

const editComment = (
    notification: Hikka.Notification<Hikka.NotificationCommentData>,
): Hikka.TextNotification => {
    const { comment_author, slug, content_type } = notification.data;

    return {
        ...getInitialData(notification),
        description:
            DESCRIPTIONS[notification.notification_type](comment_author),
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}`,
    };
};

const editActions = (
    notification: Hikka.Notification<Hikka.NotificationEditData>,
): Hikka.TextNotification => {
    const { edit_id } = notification.data;

    return {
        ...getInitialData(notification),
        description: DESCRIPTIONS[notification.notification_type](),
        href: `/edit/${edit_id}`,
    };
};

const hikkaUpdate = (
    notification: Hikka.Notification<Hikka.NotificationHikkaData>,
) => {
    return {
        ...getInitialData(notification),
        title: notification.data.title || TITLES[notification.notification_type],
        description: DESCRIPTIONS[notification.notification_type](
            notification.data.description,
        ),
        href: notification.data.link,
    };
};

export const convertNotification = (
    notification: Hikka.Notification<
        | Hikka.NotificationCommentVoteData
        | Hikka.NotificationCommentData
        | Hikka.NotificationEditData
        | Hikka.NotificationHikkaData
    >,
): Hikka.TextNotification => {
    switch (notification.notification_type) {
        case 'comment_reply':
            return commentReply(
                notification as Hikka.Notification<Hikka.NotificationCommentData>,
            );
        case 'comment_vote':
            return commentVote(
                notification as Hikka.Notification<Hikka.NotificationCommentVoteData>,
            );
        case 'comment_tag':
            return commentTag(
                notification as Hikka.Notification<Hikka.NotificationCommentData>,
            );
        case 'edit_comment':
            return editComment(
                notification as Hikka.Notification<Hikka.NotificationCommentData>,
            );
        case 'edit_accepted':
            return editActions(
                notification as Hikka.Notification<Hikka.NotificationEditData>,
            );
        case 'edit_denied':
            return editActions(
                notification as Hikka.Notification<Hikka.NotificationEditData>,
            );
        case 'edit_updated':
            return editActions(
                notification as Hikka.Notification<Hikka.NotificationEditData>,
            );
        case 'hikka_update':
            return hikkaUpdate(
                notification as Hikka.Notification<Hikka.NotificationHikkaData>,
            );
    }
};
