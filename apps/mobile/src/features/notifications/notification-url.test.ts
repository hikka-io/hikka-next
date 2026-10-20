import { describe, expect, it } from 'vitest';

import { NO_NOTIFICATION_HREF } from '@hikka/core';

import { resolveLink } from '@/components/markdown/links';

import { badgeText, notificationUrl } from './notification-url';

describe('notificationUrl', () => {
    it('turns a site path into a hikka.io URL', () => {
        expect(notificationUrl('/anime/frieren')).toBe(
            'https://hikka.io/anime/frieren',
        );
    });

    it('keeps an absolute link and drops the placeholder', () => {
        expect(notificationUrl('https://example.com/x')).toBe(
            'https://example.com/x',
        );
        expect(notificationUrl(NO_NOTIFICATION_HREF)).toBeNull();
    });

    it('opens content, profiles and the schedule in the app', () => {
        for (const path of ['/anime/frieren', '/u/olex']) {
            expect(resolveLink(notificationUrl(path) ?? '')).toEqual({
                kind: 'route',
                href: path,
            });
        }
    });
});

describe('badgeText', () => {
    it('caps the count', () => {
        expect(badgeText(7)).toBe('7');
        expect(badgeText(99)).toBe('99');
        expect(badgeText(100)).toBe('99+');
    });
});
