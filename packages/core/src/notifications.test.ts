import { afterEach, describe, expect, it, vi } from 'vitest';

import { type NotificationResponse, NotificationTypeEnum } from '@hikka/api';

import {
    convertNotification,
    groupNotificationsByDay,
    NO_NOTIFICATION_HREF,
    NOTIFICATION_TITLES,
} from './notifications';

const response = (
    type: NotificationTypeEnum,
    data: Record<string, unknown>,
    overrides: Partial<NotificationResponse> = {},
) =>
    ({
        notification_type: type,
        initiator_user: null,
        created: 1_700_000_000,
        reference: 'ref',
        seen: false,
        data,
        ...overrides,
    }) as NotificationResponse;

describe('convertNotification', () => {
    it('describes a comment reply with the actor and links to the thread', () => {
        const item = convertNotification(
            response(NotificationTypeEnum.COMMENT_REPLY, {
                slug: 'frieren',
                content_type: 'anime',
                base_comment_reference: 'abc',
                comment_text: 'hi',
                username: 'olex',
                avatar: 'a.png',
            }),
        );

        expect(item).toMatchObject({
            title: 'Новий коментар',
            description: 'Користувач **olex** відповів на Ваш коментар',
            href: '/comments/anime/frieren/abc',
            preview: 'hi',
            accent: 'info',
            actor: { username: 'olex', avatar: 'a.png', href: '/u/olex' },
        });
    });

    it('falls back to the initiator when a downvote hides the user', () => {
        const item = convertNotification(
            response(
                NotificationTypeEnum.COLLECTION_VOTE,
                { slug: 'col', user_score: -1 },
                {
                    initiator_user: {
                        username: 'dv',
                        avatar: 'd.png',
                    } as NotificationResponse['initiator_user'],
                },
            ),
        );

        expect(item).toMatchObject({
            accent: 'destructive',
            scoreSign: -1,
            href: '/collections/col',
            actor: { username: 'dv' },
        });
    });

    it('uses the anonymous copy without an actor', () => {
        const item = convertNotification(
            response(NotificationTypeEnum.FOLLOW, {}),
        );

        expect(item?.description).toBe('Хтось підписався на Ваш профіль');
        expect(item?.href).toBe(NO_NOTIFICATION_HREF);
    });

    it('builds the episode notification from the anime payload', () => {
        const item = convertNotification(
            response(NotificationTypeEnum.SCHEDULE_ANIME, {
                slug: 'frieren',
                title_ua: 'Фрірен',
                image: 'p.jpg',
                after: { status: 'ongoing', episodes_released: 7 },
                before: { status: 'ongoing', episodes_released: 6 },
            }),
        );

        expect(item).toMatchObject({
            title: 'Фрірен',
            description: 'Вийшов **7** епізод аніме',
            href: '/anime/frieren',
            contentImage: 'p.jpg',
        });
    });

    it('keeps a Hikka update link and falls back to the default title', () => {
        const item = convertNotification(
            response(NotificationTypeEnum.HIKKA_UPDATE, {
                title: '',
                description: 'Нове',
                link: 'https://hikka.io/x',
            }),
        );

        expect(item?.title).toBe(
            NOTIFICATION_TITLES[NotificationTypeEnum.HIKKA_UPDATE],
        );
        expect(item?.href).toBe('https://hikka.io/x');
    });

    it('returns null for an unknown type', () => {
        expect(
            convertNotification(
                response('brand_new' as NotificationTypeEnum, {}),
            ),
        ).toBeNull();
    });
});

describe('groupNotificationsByDay', () => {
    afterEach(() => vi.useRealTimers());

    it('splits today, yesterday and earlier', () => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-09-29T12:00:00'));
        const at = (iso: string) => ({
            created: new Date(iso).getTime() / 1000,
        });
        const today = at('2026-09-29T01:00:00');
        const yesterday = at('2026-09-28T23:00:00');
        const earlier = at('2026-09-20T10:00:00');

        expect(
            groupNotificationsByDay([today, yesterday, earlier]),
        ).toStrictEqual({
            today: [today],
            yesterday: [yesterday],
            earlier: [earlier],
        });
    });
});
