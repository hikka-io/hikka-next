import FeMention from '~icons/fe/mention';
import MaterialSymbolsAddCommentRounded from '~icons/material-symbols/add-comment-rounded';
import MaterialSymbolsCheckCircleRounded from '~icons/material-symbols/check-circle-rounded';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';
import MaterialSymbolsFlagCircleRounded from '~icons/material-symbols/flag-circle-rounded';

import { CONTENT_TYPE_LINKS } from '@/utils/constants';

const commentReply = (
    notification: Hikka.Notification<Hikka.NotificationCommentData>,
): Hikka.TextNotification => {
    const { comment_author, slug, content_type } = notification.data;
    const { reference, created, seen } = notification;

    return {
        icon: <MaterialSymbolsAddCommentRounded />,
        type: 'comment',
        title: 'Новий коментар',
        description: (
            <>
                <span className="font-bold">@{comment_author}</span> відповів на
                Ваш коментар
            </>
        ),
        reference: reference,
        created: created,
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}`,
        seen: seen,
    };
};

const commentVote = (
    notification: Hikka.Notification<Hikka.NotificationCommentVoteData>,
): Hikka.TextNotification => {
    const { slug, content_type } = notification.data;
    const { reference, created, seen } = notification;

    return {
        icon: <MaterialSymbolsFavoriteRounded />,
        type: 'vote',
        title: 'Нова оцінка',
        description: <>Ваш коментар оцінили</>,
        reference: reference,
        created: created,
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}`,
        seen: seen,
    };
};

const commentTag = (
    notification: Hikka.Notification<Hikka.NotificationCommentData>,
): Hikka.TextNotification => {
    const { comment_author, slug, content_type } = notification.data;
    const { reference, created, seen } = notification;

    return {
        icon: <FeMention />,
        type: 'tag',
        title: 'Нова згадка',
        description: (
            <>
                <span className="font-bold">@{comment_author}</span> згадав Вас
                у коментарі
            </>
        ),
        reference: reference,
        created: created,
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}`,
        seen: seen,
    };
};

const editComment = (
    notification: Hikka.Notification<Hikka.NotificationCommentData>,
): Hikka.TextNotification => {
    const { comment_author, slug, content_type } = notification.data;
    const { reference, created, seen } = notification;

    return {
        icon: <MaterialSymbolsAddCommentRounded />,
        type: 'comment',
        title: 'Новий коментар у правці',
        description: (
            <>
                <span className="font-bold">@{comment_author}</span> залишив
                коментар
            </>
        ),
        reference: reference,
        created: created,
        href: `${CONTENT_TYPE_LINKS[content_type]}/${slug}`,
        seen: seen,
    };
};

const editAccepted = (
    notification: Hikka.Notification<Hikka.NotificationEditData>,
): Hikka.TextNotification => {
    const { edit_id } = notification.data;
    const { reference, created, seen } = notification;

    return {
        icon: <MaterialSymbolsCheckCircleRounded />,
        type: 'edit',
        title: 'Правка прийнята',
        description: <>Ваша правка була прийнята</>,
        reference: reference,
        created: created,
        href: `/edit/${edit_id}`,
        seen: seen,
    };
};

const editDenied = (
    notification: Hikka.Notification<Hikka.NotificationEditData>,
): Hikka.TextNotification => {
    const { edit_id } = notification.data;
    const { reference, created, seen } = notification;

    return {
        icon: <MaterialSymbolsFlagCircleRounded />,
        type: 'edit',
        title: 'Правка відхилена',
        description: <>Ваша правка була відхилена</>,
        reference: reference,
        created: created,
        href: `/edit/${edit_id}`,
        seen: seen,
    };
};

export const convertNotification = (
    notification: Hikka.Notification<
        | Hikka.NotificationCommentVoteData
        | Hikka.NotificationCommentData
        | Hikka.NotificationEditData
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
            return editAccepted(
                notification as Hikka.Notification<Hikka.NotificationEditData>,
            );
        case 'edit_denied':
            return editDenied(
                notification as Hikka.Notification<Hikka.NotificationEditData>,
            );
    }
};
