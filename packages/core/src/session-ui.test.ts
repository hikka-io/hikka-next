import { describe, expect, it } from 'vitest';

import { DEFAULT_STYLES, DEFAULT_USER_UI } from './customization-defaults';
import { applySessionUIPatch } from './session-ui';

describe('applySessionUIPatch', () => {
    it('starts from the defaults and sends no styles when none differ', () => {
        const { next, payload } = applySessionUIPatch(undefined, {
            preferences: { title_language: 'title_en' },
        });

        expect(next.preferences.title_language).toBe('title_en');
        expect(next.preferences.name_language).toBe(
            DEFAULT_USER_UI.preferences.name_language,
        );
        expect(payload.styles).toEqual({});
        expect(payload.preferences).toEqual(next.preferences);
    });

    it('sends only the styles that differ from the defaults', () => {
        const brand = { l: 0.5, c: 0.2, h: 10 };
        const { next, payload } = applySessionUIPatch(undefined, {
            styles: { ...DEFAULT_STYLES, brand },
        });

        expect(next.styles.brand).toEqual(brand);
        expect(payload.styles).toEqual({ brand });
    });

    it('keeps the feed widgets when only a feed flag changes', () => {
        const { next } = applySessionUIPatch(DEFAULT_USER_UI, {
            preferences: { feed: { only_followed: true } },
        });

        expect(next.preferences.feed?.only_followed).toBe(true);
        expect(next.preferences.feed?.widgets).toEqual(
            DEFAULT_USER_UI.preferences.feed?.widgets,
        );
    });

    it('leaves the current document untouched', () => {
        applySessionUIPatch(DEFAULT_USER_UI, {
            preferences: { show_nsfw: true },
        });

        expect(DEFAULT_USER_UI.preferences.show_nsfw).toBe(false);
    });
});
