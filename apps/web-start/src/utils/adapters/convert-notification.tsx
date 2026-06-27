import type { ReactNode } from 'react';

import {
    type ContentStatusEnum,
    type ContentTypeEnum,
    type NotificationResponse,
    NotificationTypeEnum,
} from '@hikka/api';

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
import { getTitle } from '@/utils/title/get-title';

// @hikka/api types `NotificationResponse.data` as a loose `{ [key]: unknown }`.
// `NotificationOf<T>` re-attaches a concrete per-type `data` shape so the
// helpers below can keep their narrow signatures; the dispatcher narrows
// `notification.data` by `notification_type` before handing off. The data
// shapes mirror the legacy client `types/notifications.ts`.
type NotificationOf<TData> = Omit<NotificationResponse, 'data'> & {
    data: TData;
};

interface NotificationFollowData {
    username: string;
    avatar: string;
}

interface NotificationThirdpartyLoginData {
    scope: string[];
    client: {
        name: string;
        reference: string;
        description: string;
    };
}

interface NotificationCommentData {
    slug: string;
    comment_text: string;
    content_type: ContentTypeEnum;
    comment_depth: number;
    comment_reference: string;
    base_comment_reference: string;
    username: string;
    avatar: string;
}

interface NotificationVoteData {
    slug: string;
    user_score: number;
    old_score: number;
    new_score: number;
    username: string;
    avatar: string;
}

interface NotificationCommentVoteData extends NotificationVoteData {
    content_type: ContentTypeEnum;
    comment_reference: string;
    comment_depth: number;
    comment_text: string;
    base_comment_reference: string;
}

interface NotificationEditData {
    description: string;
    edit_id: number;
}

interface NotificationHikkaData {
    description: string;
    title: string;
    link: string;
}

interface NotificationScheduleAnimeData {
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

type NotificationData =
    | NotificationCommentVoteData
    | NotificationCommentData
    | NotificationEditData
    | NotificationHikkaData
    | NotificationScheduleAnimeData
    | NotificationFollowData
    | NotificationVoteData
    | NotificationThirdpartyLoginData;

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
    notification: NotificationOf<NotificationData>,
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
    notification: NotificationOf<NotificationData>,
): Omit<Hikka.Notification, 'description' | 'href'> => {
    // @hikka/api types `notification_type` as a loose `string`; narrow to the
    // enum so the keyed lookup tables below index correctly.
    const type = notification.notification_type as NotificationTypeEnum;

    return {
        reference: notification.reference,
        type,
        created: notification.created,
        seen: notification.seen,
        title: NOTIFICATION_TITLES[type],
        typeIcon: NOTIFICATION_ICONS[type],
        accent: NOTIFICATION_ACCENTS[type],
    };
};

interface ActorCopy {
    withActor: (username: string) => string;
    withoutActor: string;
}

const createCommentNotification = (
    notification: NotificationOf<NotificationCommentData>,
    copy: ActorCopy,
): Hikka.Notification => {
    const { slug, content_type, base_comment_reference, comment_text } =
        notification.data;
    const actor = resolveActor(notification);

    return {
        ...getBaseNotification(notification),
        description: actor
            ? copy.withActor(actor.username!)
            : copy.withoutActor,
        href: getCommentLink(content_type, slug, base_comment_reference),
        actor,
        preview: comment_text || undefined,
    };
};

const createVoteNotification = (
    notification: NotificationOf<NotificationVoteData>,
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
        description: actor
            ? copy.withActor(actor.username!)
            : copy.withoutActor,
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
    | typeof NotificationTypeEnum.EDIT_ACCEPTED
    | typeof NotificationTypeEnum.EDIT_DENIED
    | typeof NotificationTypeEnum.EDIT_UPDATED;

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
    notification: NotificationOf<NotificationCommentVoteData>,
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
    notification: NotificationOf<NotificationEditData>,
    type: EditActionType,
): Hikka.Notification => {
    const { edit_id, description } = notification.data;
    const actor = resolveActor(notification);
    const copy = EDIT_ACTION_COPY[type];

    return {
        ...getBaseNotification(notification),
        description: actor
            ? copy.withActor(actor.username!)
            : copy.withoutActor,
        href: `/edit/${edit_id}`,
        actor,
        preview: description || undefined,
    };
};

const createHikkaUpdateNotification = (
    notification: NotificationOf<NotificationHikkaData>,
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
    notification: NotificationOf<NotificationScheduleAnimeData>,
): Hikka.Notification => {
    const { slug, image, after } = notification.data;

    return {
        ...getBaseNotification(notification),
        title: getTitle(notification.data),
        description: `Вийшов **${after.episodes_released}** епізод аніме`,
        href: `/anime/${slug}`,
        contentImage: image || undefined,
    };
};

const createFollowNotification = (
    notification: NotificationOf<NotificationFollowData>,
): Hikka.Notification => {
    const actor = resolveActor(notification);

    return {
        ...getBaseNotification(notification),
        description: actor
            ? FOLLOW_COPY.withActor(actor.username!)
            : FOLLOW_COPY.withoutActor,
        href: actor ? `/u/${actor.username}` : '#',
        actor,
    };
};

const createThirdpartyLoginNotification = (
    notification: NotificationOf<NotificationThirdpartyLoginData>,
): Hikka.Notification => {
    const { client } = notification.data;

    return {
        ...getBaseNotification(notification),
        description: `Ви авторизувались через сторонній застосунок **${client.name}**`,
        href: '#',
    };
};

export const convertNotification = (
    response: NotificationResponse,
): Hikka.Notification | null => {
    // The generated `data` is a broad untyped shape; refine it once to the
    // discriminated union so each branch can narrow by notification_type.
    const notification =
        response as unknown as NotificationOf<NotificationData>;
    const type = notification.notification_type;

    switch (type) {
        case NotificationTypeEnum.COMMENT_REPLY:
            return createCommentNotification(
                notification as NotificationOf<NotificationCommentData>,
                COMMENT_REPLY_COPY,
            );

        case NotificationTypeEnum.COMMENT_TAG:
            return createCommentNotification(
                notification as NotificationOf<NotificationCommentData>,
                COMMENT_TAG_COPY,
            );

        case NotificationTypeEnum.EDIT_COMMENT:
        case NotificationTypeEnum.COLLECTION_COMMENT:
        case NotificationTypeEnum.ARTICLE_COMMENT:
            return createCommentNotification(
                notification as NotificationOf<NotificationCommentData>,
                COMMENT_GENERIC_COPY,
            );

        case NotificationTypeEnum.ARTICLE_VOTE:
            return createVoteNotification(
                notification as NotificationOf<NotificationVoteData>,
                ARTICLE_VOTE_COPY,
                `/articles/${(notification.data as NotificationVoteData).slug}`,
            );

        case NotificationTypeEnum.COMMENT_VOTE:
            return createCommentVoteNotification(
                notification as NotificationOf<NotificationCommentVoteData>,
            );

        case NotificationTypeEnum.COLLECTION_VOTE:
            return createVoteNotification(
                notification as NotificationOf<NotificationVoteData>,
                COLLECTION_VOTE_COPY,
                `/collections/${(notification.data as NotificationVoteData).slug}`,
            );

        case NotificationTypeEnum.EDIT_ACCEPTED:
        case NotificationTypeEnum.EDIT_DENIED:
        case NotificationTypeEnum.EDIT_UPDATED:
            return createEditActionNotification(
                notification as NotificationOf<NotificationEditData>,
                type,
            );

        case NotificationTypeEnum.HIKKA_UPDATE:
            return createHikkaUpdateNotification(
                notification as NotificationOf<NotificationHikkaData>,
            );

        case NotificationTypeEnum.SCHEDULE_ANIME:
            return createScheduleAnimeNotification(
                notification as NotificationOf<NotificationScheduleAnimeData>,
            );

        case NotificationTypeEnum.FOLLOW:
            return createFollowNotification(
                notification as NotificationOf<NotificationFollowData>,
            );

        case NotificationTypeEnum.THIRDPARTY_LOGIN:
            return createThirdpartyLoginNotification(
                notification as NotificationOf<NotificationThirdpartyLoginData>,
            );

        default:
            return null;
    }
};
