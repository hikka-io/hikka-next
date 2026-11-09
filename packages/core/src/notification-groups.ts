import { NotificationTypeEnum } from '@hikka/api';

import { getDeclensionWord, type WordForms } from './i18n/declension';
import { TIMES_FORMS } from './i18n/word-forms';
import type { NotificationActor, NotificationItem } from './notifications';

export type NotificationEntry<T extends NotificationItem> =
    | { kind: 'single'; item: T }
    | { kind: 'group'; key: string; items: T[] };

const getGroupKey = (item: NotificationItem): string | null => {
    switch (item.type) {
        case NotificationTypeEnum.HIKKA_UPDATE:
            return null;
        // The title is the anime title, so episodes collapse per anime.
        case NotificationTypeEnum.SCHEDULE_ANIME:
            return `${item.type}:${item.title}`;
        // The description names the client, so logins collapse per application.
        case NotificationTypeEnum.THIRDPARTY_LOGIN:
            return `${item.type}:${item.description}`;
        default:
            return `${item.type}:${item.scoreSign ?? 0}`;
    }
};

/**
 * Aggregates notifications of the same kind into groups of two or more, wherever they sit in `items`.
 * A group takes the place of its newest member, so with newest-first input the order stays by latest activity.
 * Call it per time window (e.g. per day section) to keep old activity out of fresh groups.
 */
export const groupSimilarNotifications = <T extends NotificationItem>(
    items: T[],
): NotificationEntry<T>[] => {
    const entries: (NotificationEntry<T> & { kind: 'group' })[] = [];
    const byKey = new Map<string, T[]>();
    let ungrouped = 0;

    for (const item of items) {
        const key = getGroupKey(item);
        const bucket = key === null ? undefined : byKey.get(key);
        if (bucket) {
            bucket.push(item);
            continue;
        }
        const fresh = [item];
        if (key !== null) byKey.set(key, fresh);
        entries.push({
            kind: 'group',
            key: key ?? `#${ungrouped++}`,
            items: fresh,
        });
    }

    return entries.map((entry) =>
        entry.items.length > 1
            ? entry
            : { kind: 'single', item: entry.items[0] },
    );
};

type GroupCopy = {
    subject: readonly [one: string, many: string];
    verb: readonly [one: string, many: string];
    object: {
        same: string;
        forms?: WordForms;
        prefix?: string;
        countBy?: 'target' | 'item';
    };
};

const USER_SUBJECT = ['Користувач', 'Користувачі'] as const;
const MODERATOR_SUBJECT = ['Модератор', 'Модератори'] as const;
const RATED_VERB = ['оцінив', 'оцінили'] as const;

const EDIT_OBJECT: GroupCopy['object'] = {
    same: 'Вашу правку',
    forms: ['Вашу правку', 'Ваші правки', 'Ваших правок'],
};

const COMMENT_OBJECT: GroupCopy['object'] = {
    same: 'Ваш коментар',
    forms: ['Ваш коментар', 'Ваші коментарі', 'Ваших коментарів'],
};

const LEFT_COMMENT_COPY: GroupCopy = {
    subject: USER_SUBJECT,
    verb: ['залишив', 'залишили'],
    object: {
        same: 'коментар',
        forms: ['коментар', 'коментарі', 'коментарів'],
        countBy: 'item',
    },
};

const GROUP_COPY: Partial<Record<NotificationTypeEnum, GroupCopy>> = {
    [NotificationTypeEnum.EDIT_ACCEPTED]: {
        subject: MODERATOR_SUBJECT,
        verb: ['прийняв', 'прийняли'],
        object: EDIT_OBJECT,
    },
    [NotificationTypeEnum.EDIT_DENIED]: {
        subject: MODERATOR_SUBJECT,
        verb: ['відхилив', 'відхилили'],
        object: EDIT_OBJECT,
    },
    [NotificationTypeEnum.EDIT_UPDATED]: {
        subject: MODERATOR_SUBJECT,
        verb: ['оновив', 'оновили'],
        object: EDIT_OBJECT,
    },
    [NotificationTypeEnum.COMMENT_REPLY]: {
        subject: USER_SUBJECT,
        verb: ['відповів', 'відповіли'],
        object: { ...COMMENT_OBJECT, prefix: 'на ' },
    },
    [NotificationTypeEnum.COMMENT_TAG]: {
        subject: USER_SUBJECT,
        verb: ['згадав', 'згадали'],
        object: {
            same: 'Вас у коментарі',
            forms: ['коментарі', 'коментарях', 'коментарях'],
            prefix: 'Вас у ',
        },
    },
    [NotificationTypeEnum.EDIT_COMMENT]: LEFT_COMMENT_COPY,
    [NotificationTypeEnum.COLLECTION_COMMENT]: LEFT_COMMENT_COPY,
    [NotificationTypeEnum.ARTICLE_COMMENT]: LEFT_COMMENT_COPY,
    [NotificationTypeEnum.COMMENT_VOTE]: {
        subject: USER_SUBJECT,
        verb: RATED_VERB,
        object: COMMENT_OBJECT,
    },
    [NotificationTypeEnum.ARTICLE_VOTE]: {
        subject: USER_SUBJECT,
        verb: RATED_VERB,
        object: {
            same: 'Вашу статтю',
            forms: ['Вашу статтю', 'Ваші статті', 'Ваших статей'],
        },
    },
    [NotificationTypeEnum.COLLECTION_VOTE]: {
        subject: USER_SUBJECT,
        verb: RATED_VERB,
        object: {
            same: 'Вашу колекцію',
            forms: ['Вашу колекцію', 'Ваші колекції', 'Ваших колекцій'],
        },
    },
    [NotificationTypeEnum.FOLLOW]: {
        subject: USER_SUBJECT,
        verb: ['підписався', 'підписалися'],
        object: { same: 'на Ваш профіль' },
    },
};

const NEW_EPISODE_FORMS = [
    'новий епізод',
    'нові епізоди',
    'нових епізодів',
] as const satisfies WordForms;

const formatActors = (usernames: string[]): string => {
    const [first, second] = usernames.map((u) => `**${u}**`);
    if (usernames.length === 1) return first;
    if (usernames.length === 2) return `${first} і ${second}`;
    return `${first}, ${second} та ще ${usernames.length - 2}`;
};

/** Distinct actors of a group, newest first. */
export const getNotificationGroupActors = (
    items: NotificationItem[],
): NotificationActor[] => {
    const actors = new Map<string, NotificationActor>();
    for (const { actor } of items) {
        if (actor?.username && !actors.has(actor.username))
            actors.set(actor.username, actor);
    }
    return [...actors.values()];
};

/** A one-line Ukrainian summary of a group, e.g. "Користувачі **a** і **b** оцінили Вашу колекцію". */
export const getNotificationGroupDescription = (
    items: NotificationItem[],
): string => {
    const [latest] = items;

    if (latest.type === NotificationTypeEnum.SCHEDULE_ANIME) {
        const verb = getDeclensionWord(items.length, [
            'Вийшов',
            'Вийшли',
            'Вийшло',
        ]);
        return `${verb} **${items.length}** ${getDeclensionWord(items.length, NEW_EPISODE_FORMS)} аніме`;
    }

    if (latest.type === NotificationTypeEnum.THIRDPARTY_LOGIN) {
        return `${latest.description} **${items.length}** ${getDeclensionWord(items.length, TIMES_FORMS)}`;
    }

    const copy = GROUP_COPY[latest.type];
    if (!copy) return latest.description;

    const usernames = getNotificationGroupActors(items).map(
        (actor) => actor.username as string,
    );
    const isMany = usernames.length > 1;
    const subject =
        usernames.length === 0
            ? 'Хтось'
            : `${copy.subject[isMany ? 1 : 0]} ${formatActors(usernames)}`;

    const { same, forms, prefix = '', countBy = 'target' } = copy.object;
    const count =
        countBy === 'item'
            ? items.length
            : new Set(items.map((item) => item.href)).size;
    const object =
        !forms || (count === 1 && countBy === 'target')
            ? same
            : `${prefix}**${count}** ${getDeclensionWord(count, forms)}`;

    return `${subject} ${copy.verb[isMany ? 1 : 0]} ${object}`;
};
