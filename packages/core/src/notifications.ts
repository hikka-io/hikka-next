import { isToday, isYesterday } from 'date-fns';

import {
    type ContentStatusEnum,
    type ContentTypeEnum,
    type NotificationResponse,
    NotificationTypeEnum,
} from '@hikka/api';

import { getTitle } from './get-title';

export type NotificationActor = {
    username?: string;
    avatar?: string;
    href?: string;
};

export type NotificationAccent =
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'info'
    | 'neutral';

export type NotificationItem = {
    reference: string;
    type: NotificationTypeEnum;
    created: number;
    seen: boolean;
    title: string;
    description: string;
    /** A site path (an absolute link for a Hikka update); `NO_NOTIFICATION_HREF` when there is nowhere to go. */
    href: string;
    accent: NotificationAccent;
    actor?: NotificationActor;
    preview?: string;
    scoreSign?: 1 | -1;
    contentImage?: string;
};

export const NO_NOTIFICATION_HREF = '#';

// `NotificationResponse.data` is a loose `{ [key]: unknown }`; the shapes below match the API payloads per type.
type NotificationOf<TData> = Omit<NotificationResponse, 'data'> & {
    data: TData;
};

type NotificationFollowData = {
    username: string;
    avatar: string;
};

type NotificationThirdpartyLoginData = {
    scope: string[];
    client: {
        name: string;
        reference: string;
        description: string;
    };
};

type NotificationCommentData = {
    slug: string;
    comment_text: string;
    content_type: ContentTypeEnum;
    comment_depth: number;
    comment_reference: string;
    base_comment_reference: string;
    username: string;
    avatar: string;
};

type NotificationVoteData = {
    slug: string;
    user_score: number;
    old_score: number;
    new_score: number;
    username: string;
    avatar: string;
};

type NotificationCommentVoteData = NotificationVoteData & {
    content_type: ContentTypeEnum;
    comment_reference: string;
    comment_depth: number;
    comment_text: string;
    base_comment_reference: string;
};

type NotificationEditData = {
    description: string;
    edit_id: number;
};

type NotificationHikkaData = {
    description: string;
    title: string;
    link: string;
};

type NotificationScheduleAnimeData = {
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
};

type NotificationData =
    | NotificationCommentVoteData
    | NotificationCommentData
    | NotificationEditData
    | NotificationHikkaData
    | NotificationScheduleAnimeData
    | NotificationFollowData
    | NotificationVoteData
    | NotificationThirdpartyLoginData;

export const NOTIFICATION_TITLES: Record<NotificationTypeEnum, string> = {
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

// Vote types are `neutral` here and overridden by the vote builder from the score sign.
export const NOTIFICATION_ACCENTS: Record<
    NotificationTypeEnum,
    NotificationAccent
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

// Downvotes hide the downvoter in the per-type data, so fall back to `initiator_user` on the envelope.
const resolveActor = (
    notification: NotificationOf<NotificationData>,
): NotificationActor | undefined => {
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

const getBaseNotification = (
    notification: NotificationOf<NotificationData>,
): Omit<NotificationItem, 'description' | 'href'> => {
    const type = notification.notification_type as NotificationTypeEnum;

    return {
        reference: notification.reference,
        type,
        created: notification.created,
        seen: notification.seen,
        title: NOTIFICATION_TITLES[type],
        accent: NOTIFICATION_ACCENTS[type],
    };
};

type ActorCopy = {
    withActor: (username: string) => string;
    withoutActor: string;
};

const copyFor = (copy: ActorCopy, actor: NotificationActor | undefined) =>
    actor?.username ? copy.withActor(actor.username) : copy.withoutActor;

const createCommentNotification = (
    notification: NotificationOf<NotificationCommentData>,
    copy: ActorCopy,
): NotificationItem => {
    const { slug, content_type, base_comment_reference, comment_text } =
        notification.data;
    const actor = resolveActor(notification);

    return {
        ...getBaseNotification(notification),
        description: copyFor(copy, actor),
        href: getCommentLink(content_type, slug, base_comment_reference),
        actor,
        preview: comment_text || undefined,
    };
};

const createVoteNotification = (
    notification: NotificationOf<NotificationVoteData>,
    copy: ActorCopy,
    href: string,
): NotificationItem => {
    const { user_score } = notification.data;
    const actor = resolveActor(notification);
    const scoreSign: 1 | -1 = user_score > 0 ? 1 : -1;

    return {
        ...getBaseNotification(notification),
        accent: scoreSign > 0 ? 'success' : 'destructive',
        description: copyFor(copy, actor),
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
): NotificationItem => {
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
): NotificationItem => {
    const { edit_id, description } = notification.data;
    const actor = resolveActor(notification);

    return {
        ...getBaseNotification(notification),
        description: copyFor(EDIT_ACTION_COPY[type], actor),
        href: `/edit/${edit_id}`,
        actor,
        preview: description || undefined,
    };
};

const createHikkaUpdateNotification = (
    notification: NotificationOf<NotificationHikkaData>,
): NotificationItem => {
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
): NotificationItem => {
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
): NotificationItem => {
    const actor = resolveActor(notification);

    return {
        ...getBaseNotification(notification),
        description: copyFor(FOLLOW_COPY, actor),
        href: actor ? `/u/${actor.username}` : NO_NOTIFICATION_HREF,
        actor,
    };
};

const createThirdpartyLoginNotification = (
    notification: NotificationOf<NotificationThirdpartyLoginData>,
): NotificationItem => {
    const { client } = notification.data;

    return {
        ...getBaseNotification(notification),
        description: `Ви авторизувались через сторонній застосунок **${client.name}**`,
        href: NO_NOTIFICATION_HREF,
    };
};

/** Copy, link, actor and accent of one notification; `null` for a type this client does not know. */
export const convertNotification = (
    response: NotificationResponse,
): NotificationItem | null => {
    // The generated `data` is untyped; each branch narrows it by `notification_type`.
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

export type GroupedNotifications<T extends { created: number }> = {
    today: T[];
    yesterday: T[];
    earlier: T[];
};

export const NOTIFICATION_SECTIONS = [
    { key: 'today', label: 'Сьогодні' },
    { key: 'yesterday', label: 'Вчора' },
    { key: 'earlier', label: 'Раніше' },
] as const satisfies readonly {
    key: keyof GroupedNotifications<{ created: number }>;
    label: string;
}[];

export const groupNotificationsByDay = <T extends { created: number }>(
    items: T[],
): GroupedNotifications<T> => {
    const result: GroupedNotifications<T> = {
        today: [],
        yesterday: [],
        earlier: [],
    };

    for (const item of items) {
        const ms = item.created * 1000;
        if (isToday(ms)) result.today.push(item);
        else if (isYesterday(ms)) result.yesterday.push(item);
        else result.earlier.push(item);
    }

    return result;
};
