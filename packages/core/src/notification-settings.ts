import { NotificationTypeEnum } from '@hikka/api';

const GROUPS = [
    { id: 'comments', title: 'Коментарі' },
    { id: 'votes', title: 'Оцінки' },
    { id: 'edits', title: 'Правки' },
    { id: 'anime', title: 'Аніме' },
    { id: 'users', title: 'Користувачі' },
    { id: 'other', title: 'Інше' },
] as const;

type Setting = {
    group: (typeof GROUPS)[number]['id'];
    label: string;
    description: string;
};

const NOTIFICATION_SETTINGS = {
    comment_reply: {
        group: 'comments',
        label: 'Відповідь на коментар',
        description: 'Ви отримаєте сповіщення, коли на ваш коментар відповіли',
    },
    comment_vote: {
        group: 'votes',
        label: 'Оцінка коментаря',
        description: 'Ви отримаєте сповіщення, коли ваш коментар оцінили',
    },
    comment_tag: {
        group: 'comments',
        label: 'Згадка в коментарі',
        description: 'Ви отримаєте сповіщення, коли вас згадали(@) в коментарі',
    },
    collection_comment: {
        group: 'comments',
        label: 'Коментар у колекції',
        description:
            'Ви отримаєте сповіщення, коли у вашій колекції залишили коментар',
    },
    article_comment: {
        group: 'comments',
        label: 'Коментар у статті',
        description:
            'Ви отримаєте сповіщення, коли у вашій статті залишили коментар',
    },
    collection_vote: {
        group: 'votes',
        label: 'Оцінка колекції',
        description: 'Ви отримаєте сповіщення, коли вашу колекцію оцінили',
    },
    article_vote: {
        group: 'votes',
        label: 'Оцінка статті',
        description: 'Ви отримаєте сповіщення, коли вашу статтю оцінили',
    },
    edit_comment: {
        group: 'comments',
        label: 'Коментар у правці',
        description:
            'Ви отримаєте сповіщення, коли вам залишать коментар у правці',
    },
    edit_accepted: {
        group: 'edits',
        label: 'Прийнята правка',
        description: 'Ви отримаєте сповіщення, коли ваша правка прийнята',
    },
    edit_denied: {
        group: 'edits',
        label: 'Відхилена правка',
        description: 'Ви отримаєте сповіщення, коли ваша правка відхилена',
    },
    edit_updated: null,
    hikka_update: {
        group: 'other',
        label: 'Системні сповіщення',
        description: 'Ви отримаєте сповіщення про системні зміни',
    },
    schedule_anime: {
        group: 'anime',
        label: 'Оновлення аніме',
        description: 'Ви отримаєте сповіщення про вихід нових епізодів аніме',
    },
    follow: {
        group: 'users',
        label: 'Підписка на користувача',
        description: 'Ви отримаєте сповіщення, коли хтось підписався на Вас',
    },
    thirdparty_login: null,
} satisfies Record<NotificationTypeEnum, Setting | null>;

export const NOTIFICATION_TYPES = Object.values(NotificationTypeEnum);

export const NOTIFICATION_GROUPS = GROUPS.map(({ id, title }) => ({
    id,
    title,
    items: NOTIFICATION_TYPES.flatMap((type) => {
        const setting = NOTIFICATION_SETTINGS[type];

        return setting?.group === id ? [{ type, ...setting }] : [];
    }),
}));

/** Every type is on unless the backend lists it as ignored. */
export function notificationSwitches(
    ignored: readonly string[] | undefined,
): Record<string, boolean> {
    const switches: Record<string, boolean> = {};

    for (const type of NOTIFICATION_TYPES) switches[type] = true;
    for (const type of ignored ?? []) switches[type] = false;

    return switches;
}

export function ignoredNotifications(
    switches: Record<string, boolean>,
): string[] {
    return Object.entries(switches)
        .filter(([, enabled]) => !enabled)
        .map(([type]) => type);
}
