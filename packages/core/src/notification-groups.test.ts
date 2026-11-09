import { describe, expect, it } from 'vitest';

import { NotificationTypeEnum } from '@hikka/api';

import {
    getNotificationGroupDescription,
    groupSimilarNotifications,
} from './notification-groups';
import type { NotificationItem } from './notifications';

let seq = 0;
const item = (
    type: NotificationTypeEnum,
    overrides: Partial<NotificationItem> = {},
): NotificationItem => ({
    reference: `ref-${++seq}`,
    type,
    created: 1_700_000_000,
    seen: true,
    title: 'title',
    description: 'description',
    href: '/x',
    accent: 'neutral',
    ...overrides,
});

const actor = (username: string) => ({ username, href: `/u/${username}` });

describe('groupSimilarNotifications', () => {
    it('collapses consecutive notifications of the same kind', () => {
        const a = item(NotificationTypeEnum.EDIT_ACCEPTED);
        const b = item(NotificationTypeEnum.EDIT_ACCEPTED);
        const c = item(NotificationTypeEnum.FOLLOW);

        expect(groupSimilarNotifications([a, b, c])).toStrictEqual([
            { kind: 'group', key: expect.any(String), items: [a, b] },
            { kind: 'single', item: c },
        ]);
    });

    it('groups non-adjacent items at the position of the newest one', () => {
        const a = item(NotificationTypeEnum.COMMENT_REPLY);
        const b = item(NotificationTypeEnum.FOLLOW);
        const c = item(NotificationTypeEnum.COMMENT_REPLY);

        expect(groupSimilarNotifications([a, b, c])).toStrictEqual([
            { kind: 'group', key: expect.any(String), items: [a, c] },
            { kind: 'single', item: b },
        ]);
    });

    it('keys a group by kind so it stays stable as items arrive', () => {
        const a = item(NotificationTypeEnum.FOLLOW);
        const b = item(NotificationTypeEnum.FOLLOW);
        const c = item(NotificationTypeEnum.FOLLOW);

        const [before] = groupSimilarNotifications([b, c]);
        const [after] = groupSimilarNotifications([a, b, c]);
        expect(before.kind === 'group' && before.key).toBe(
            after.kind === 'group' && after.key,
        );
    });

    it('groups third-party logins per application', () => {
        const x = (description: string) =>
            item(NotificationTypeEnum.THIRDPARTY_LOGIN, { description });
        const a = x('app **ukrsubs**');
        const b = x('app **other**');
        const c = x('app **ukrsubs**');

        expect(
            groupSimilarNotifications([a, b, c]).map((e) => e.kind),
        ).toStrictEqual(['group', 'single']);
    });

    it('splits upvotes from downvotes', () => {
        const up = item(NotificationTypeEnum.COMMENT_VOTE, { scoreSign: 1 });
        const down = item(NotificationTypeEnum.COMMENT_VOTE, {
            scoreSign: -1,
        });

        expect(
            groupSimilarNotifications([up, down]).map((e) => e.kind),
        ).toStrictEqual(['single', 'single']);
    });

    it('never groups Hikka updates', () => {
        const a = item(NotificationTypeEnum.HIKKA_UPDATE);
        const b = item(NotificationTypeEnum.HIKKA_UPDATE);

        expect(
            groupSimilarNotifications([a, b]).map((e) => e.kind),
        ).toStrictEqual(['single', 'single']);
    });

    it('groups new episodes only for the same anime', () => {
        const a = item(NotificationTypeEnum.SCHEDULE_ANIME, { title: 'A' });
        const b = item(NotificationTypeEnum.SCHEDULE_ANIME, { title: 'A' });
        const c = item(NotificationTypeEnum.SCHEDULE_ANIME, { title: 'B' });

        expect(
            groupSimilarNotifications([a, b, c]).map((e) => e.kind),
        ).toStrictEqual(['group', 'single']);
    });
});

describe('getNotificationGroupDescription', () => {
    it('counts distinct edits accepted by one moderator', () => {
        const items = [1, 2, 3, 4, 5, 6].map((id) =>
            item(NotificationTypeEnum.EDIT_ACCEPTED, {
                actor: actor('Anifloppa'),
                href: `/edit/${id}`,
            }),
        );

        expect(getNotificationGroupDescription(items)).toBe(
            'Модератор **Anifloppa** прийняв **6** Ваших правок',
        );
    });

    it('lists voters on the same collection', () => {
        const items = ['Lorg0n', 'Nagicchi', 'copok', 'baaka', 'baaka'].map(
            (u) =>
                item(NotificationTypeEnum.COLLECTION_VOTE, {
                    actor: actor(u),
                    href: '/collections/c',
                    scoreSign: 1,
                }),
        );

        expect(getNotificationGroupDescription(items)).toBe(
            'Користувачі **Lorg0n**, **Nagicchi** та ще 2 оцінили Вашу колекцію',
        );
    });

    it('declines the target count for votes on different comments', () => {
        const items = ['/c/1', '/c/2'].map((href) =>
            item(NotificationTypeEnum.COMMENT_VOTE, {
                actor: actor('a'),
                href,
            }),
        );

        expect(getNotificationGroupDescription(items)).toBe(
            'Користувач **a** оцінив **2** Ваші коментарі',
        );
    });

    it('keeps the follow target singular', () => {
        const items = ['a', 'b'].map((u) =>
            item(NotificationTypeEnum.FOLLOW, {
                actor: actor(u),
                href: `/u/${u}`,
            }),
        );

        expect(getNotificationGroupDescription(items)).toBe(
            'Користувачі **a** і **b** підписалися на Ваш профіль',
        );
    });

    it('summarises new episodes', () => {
        const items = [1, 2, 3].map(() =>
            item(NotificationTypeEnum.SCHEDULE_ANIME),
        );

        expect(getNotificationGroupDescription(items)).toBe(
            'Вийшли **3** нові епізоди аніме',
        );
    });

    it('counts repeated third-party logins', () => {
        const items = [1, 2, 3, 4, 5].map(() =>
            item(NotificationTypeEnum.THIRDPARTY_LOGIN, {
                description:
                    'Ви авторизувались через сторонній застосунок **ukrsubs**',
            }),
        );

        expect(getNotificationGroupDescription(items)).toBe(
            'Ви авторизувались через сторонній застосунок **ukrsubs** **5** разів',
        );
    });

    it('falls back to an anonymous subject', () => {
        const items = [1, 2].map(() =>
            item(NotificationTypeEnum.COMMENT_TAG, { href: '/c/1' }),
        );

        expect(getNotificationGroupDescription(items)).toBe(
            'Хтось згадав Вас у коментарі',
        );
    });
});
