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
import { getTitle } from '@hikka/react/utils';
import { ReactNode } from 'react';

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

// Vote types are `neutral` here and overridden by vote handlers based on score sign.
const NOTIFICATION_ACCENTS: Record<
    NotificationTypeEnum,
    Hikka.NotificationAccent
> = {
    [NotificationTypeEnum.EDIT_ACCEPTED]: 'success',
    [NotificationTypeEnum.EDIT_DENIED]: 'destructive',
    [NotificationTypeEnum.EDIT_UPDATED]: 'info',
    [NotificationTypeEnum.COMMENT_REPLY]: 'info',
    [NotificationTypeEnum.COMMENT_TAG]: 'info',
    [NotificationTypeEnum.EDIT_COMMENT]: 'info',
    [NotificationTypeEnum.COLLECTION_COMMENT]: 'info',
    [NotificationTypeEnum.ARTICLE_COMMENT]: 'info',
    [NotificationTypeEnum.HIKKA_UPDATE]: 'primary',
    [NotificationTypeEnum.SCHEDULE_ANIME]: 'warning',
    [NotificationTypeEnum.FOLLOW]: 'primary',
    [NotificationTypeEnum.THIRDPARTY_LOGIN]: 'warning',
    [NotificationTypeEnum.COMMENT_VOTE]: 'neutral',
    [NotificationTypeEnum.ARTICLE_VOTE]: 'neutral',
    [NotificationTypeEnum.COLLECTION_VOTE]: 'neutral',
};

const getCommentLink = (
    contentType: ContentTypeEnum,
    slug: string,
    commentReference: string,
): string => `/comments/${contentType}/${slug}/${commentReference}`;

// Falls back to `initiator_user` on the envelope when per-type data omits
// username/avatar — this happens for downvotes, where the API hides the
// downvoter's identity.
const resolveActor = (
    notification: NotificationResponse<NotificationData>,
): Hikka.NotificationActor | undefined => {
    const data = notification.data;
    const dataUsername =
        'username' in data && typeof data.username === 'string'
            ? data.username
            : undefined;
    const dataAvatar =
        'avatar' in data && typeof data.avatar === 'string'
            ? data.avatar
            : undefined;
    const username = dataUsername ?? notification.initiator_user?.username;
    const avatar = dataAvatar ?? notification.initiator_user?.avatar;
    if (!username) return undefined;
    return { username, avatar, href: `/u/${username}` };
};

const getVoteIcon = (score: number): ReactNode =>
    score > 0 ? (
        <MaterialSymbolsHeartPlusRounded />
    ) : (
        <MaterialSymbolsHeartMinusRounded />
    );

const getBaseNotification = (
    notification: NotificationResponse<NotificationData>,
): Omit<Hikka.Notification, 'description' | 'href'> => ({
    reference: notification.reference,
    type: notification.notification_type,
    created: notification.created,
    seen: notification.seen,
    title: NOTIFICATION_TITLES[notification.notification_type],
    typeIcon: NOTIFICATION_ICONS[notification.notification_type],
    accent: NOTIFICATION_ACCENTS[notification.notification_type],
});

interface ActorCopy {
    withActor: (username: string) => string;
    withoutActor: string;
}

const createCommentNotification = (
    notification: NotificationResponse<NotificationCommentData>,
    copy: ActorCopy,
): Hikka.Notification => {
    const { slug, content_type, base_comment_reference, comment_text } =
        notification.data;
    const actor = resolveActor(notification);

    return {
        ...getBaseNotification(notification),
        description: actor ? copy.withActor(actor.username!) : copy.withoutActor,
        href: getCommentLink(content_type, slug, base_comment_reference),
        actor,
        preview: comment_text || undefined,
    };
};

const createVoteNotification = (
    notification: NotificationResponse<NotificationVoteData>,
    copy: ActorCopy,
    href: string,
): Hikka.Notification => {
    const { user_score } = notification.data;
    const actor = resolveActor(notification);
    const scoreSign: 1 | -1 = user_score > 0 ? 1 : -1;

    return {
        ...getBaseNotification(notification),
        accent: scoreSign > 0 ? 'success' : 'destructive',
        typeIcon: getVoteIcon(user_score),
        description: actor ? copy.withActor(actor.username!) : copy.withoutActor,
        href,
        actor,
        scoreSign,
    };
};

const COMMENT_REPLY_COPY: ActorCopy = {
    withActor: (u) => `Користувач **${u}** відповів на Ваш коментар`,
    withoutActor: 'Хтось відповів на Ваш коментар',
};
const COMMENT_TAG_COPY: ActorCopy = {
    withActor: (u) => `Користувач **${u}** згадав Вас у коментарі`,
    withoutActor: 'Хтось згадав Вас у коментарі',
};
const COMMENT_GENERIC_COPY: ActorCopy = {
    withActor: (u) => `Користувач **${u}** залишив коментар`,
    withoutActor: 'Хтось залишив коментар',
};
const ARTICLE_VOTE_COPY: ActorCopy = {
    withActor: (u) => `Користувач **${u}** оцінив Вашу статтю`,
    withoutActor: 'Хтось оцінив Вашу статтю',
};
const COMMENT_VOTE_COPY: ActorCopy = {
    withActor: (u) => `Користувач **${u}** оцінив Ваш коментар`,
    withoutActor: 'Хтось оцінив Ваш коментар',
};
const COLLECTION_VOTE_COPY: ActorCopy = {
    withActor: (u) => `Користувач **${u}** оцінив Вашу колекцію`,
    withoutActor: 'Хтось оцінив Вашу колекцію',
};
const FOLLOW_COPY: ActorCopy = {
    withActor: (u) => `Користувач **${u}** підписався на Ваш профіль`,
    withoutActor: 'Хтось підписався на Ваш профіль',
};

type EditActionType =
    | NotificationTypeEnum.EDIT_ACCEPTED
    | NotificationTypeEnum.EDIT_DENIED
    | NotificationTypeEnum.EDIT_UPDATED;

const EDIT_ACTION_COPY: Record<EditActionType, ActorCopy> = {
    [NotificationTypeEnum.EDIT_ACCEPTED]: {
        withActor: (u) => `Модератор **${u}** прийняв Вашу правку`,
        withoutActor: 'Ваша правка була прийнята',
    },
    [NotificationTypeEnum.EDIT_DENIED]: {
        withActor: (u) => `Модератор **${u}** відхилив Вашу правку`,
        withoutActor: 'Ваша правка була відхилена',
    },
    [NotificationTypeEnum.EDIT_UPDATED]: {
        withActor: (u) => `Модератор **${u}** оновив Вашу правку`,
        withoutActor: 'Ваша правка була оновлена',
    },
};

const createCommentVoteNotification = (
    notification: NotificationResponse<NotificationCommentVoteData>,
): Hikka.Notification => {
    const { slug, content_type, base_comment_reference, comment_text } =
        notification.data;
    return {
        ...createVoteNotification(
            notification,
            COMMENT_VOTE_COPY,
            getCommentLink(content_type, slug, base_comment_reference),
        ),
        preview: comment_text || undefined,
    };
};

const createEditActionNotification = (
    notification: NotificationResponse<NotificationEditData>,
    type: EditActionType,
): Hikka.Notification => {
    const { edit_id, description } = notification.data;
    const actor = resolveActor(notification);
    const copy = EDIT_ACTION_COPY[type];

    return {
        ...getBaseNotification(notification),
        description: actor ? copy.withActor(actor.username!) : copy.withoutActor,
        href: `/edit/${edit_id}`,
        actor,
        preview: description || undefined,
    };
};

const createHikkaUpdateNotification = (
    notification: NotificationResponse<NotificationHikkaData>,
): Hikka.Notification => {
    const { title, description, link } = notification.data;

    return {
        ...getBaseNotification(notification),
        title: title || NOTIFICATION_TITLES[NotificationTypeEnum.HIKKA_UPDATE],
        description,
        href: link,
    };
};

const createScheduleAnimeNotification = (
    notification: NotificationResponse<NotificationScheduleAnimeData>,
): Hikka.Notification => {
    const { slug, image, after } = notification.data;

    return {
        ...getBaseNotification(notification),
        title: getTitle(
            notification.data as unknown as Record<string, unknown>,
        ),
        description: `Вийшов **${after.episodes_released}** епізод аніме`,
        href: `/anime/${slug}`,
        contentImage: image || undefined,
    };
};

const createFollowNotification = (
    notification: NotificationResponse<NotificationFollowData>,
): Hikka.Notification => {
    const actor = resolveActor(notification);

    return {
        ...getBaseNotification(notification),
        description: actor ? FOLLOW_COPY.withActor(actor.username!) : FOLLOW_COPY.withoutActor,
        href: actor ? `/u/${actor.username}` : '#',
        actor,
    };
};

const createThirdpartyLoginNotification = (
    notification: NotificationResponse<NotificationThirdpartyLoginData>,
): Hikka.Notification => {
    const { client } = notification.data;

    return {
        ...getBaseNotification(notification),
        description: `Ви авторизувались через сторонній застосунок **${client.name}**`,
        href: '#',
    };
};

export const convertNotification = (
    notification: NotificationResponse<NotificationData>,
): Hikka.Notification | null => {
    const type = notification.notification_type;

    switch (type) {
        case NotificationTypeEnum.COMMENT_REPLY:
            return createCommentNotification(
                notification as NotificationResponse<NotificationCommentData>,
                COMMENT_REPLY_COPY,
            );

        case NotificationTypeEnum.COMMENT_TAG:
            return createCommentNotification(
                notification as NotificationResponse<NotificationCommentData>,
                COMMENT_TAG_COPY,
            );

        case NotificationTypeEnum.EDIT_COMMENT:
        case NotificationTypeEnum.COLLECTION_COMMENT:
        case NotificationTypeEnum.ARTICLE_COMMENT:
            return createCommentNotification(
                notification as NotificationResponse<NotificationCommentData>,
                COMMENT_GENERIC_COPY,
            );

        case NotificationTypeEnum.ARTICLE_VOTE:
            return createVoteNotification(
                notification as NotificationResponse<NotificationVoteData>,
                ARTICLE_VOTE_COPY,
                `/articles/${(notification.data as NotificationVoteData).slug}`,
            );

        case NotificationTypeEnum.COMMENT_VOTE:
            return createCommentVoteNotification(
                notification as NotificationResponse<NotificationCommentVoteData>,
            );

        case NotificationTypeEnum.COLLECTION_VOTE:
            return createVoteNotification(
                notification as NotificationResponse<NotificationVoteData>,
                COLLECTION_VOTE_COPY,
                `/collections/${(notification.data as NotificationVoteData).slug}`,
            );

        case NotificationTypeEnum.EDIT_ACCEPTED:
        case NotificationTypeEnum.EDIT_DENIED:
        case NotificationTypeEnum.EDIT_UPDATED:
            return createEditActionNotification(
                notification as NotificationResponse<NotificationEditData>,
                type,
            );

        case NotificationTypeEnum.HIKKA_UPDATE:
            return createHikkaUpdateNotification(
                notification as NotificationResponse<NotificationHikkaData>,
            );

        case NotificationTypeEnum.SCHEDULE_ANIME:
            return createScheduleAnimeNotification(
                notification as NotificationResponse<NotificationScheduleAnimeData>,
            );

        case NotificationTypeEnum.FOLLOW:
            return createFollowNotification(
                notification as NotificationResponse<NotificationFollowData>,
            );

        case NotificationTypeEnum.THIRDPARTY_LOGIN:
            return createThirdpartyLoginNotification(
                notification as NotificationResponse<NotificationThirdpartyLoginData>,
            );

        default:
            return null;
    }
};
