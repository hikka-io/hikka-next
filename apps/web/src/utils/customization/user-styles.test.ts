import { describe, expect, it } from 'vitest';

import type { UiStylesOutput } from '@hikka/api';

import { DEFAULT_STYLES } from './defaults';
import type { EventTheme } from './event-themes';
import { mergeUserStyles } from './user-styles';

const EVENT_THEME: EventTheme = {
    id: 'test',
    name: 'Test',
    styles: {
        brand: { l: 0.6, c: 0.1, h: 100 },
        backdrop: { style: 'glow', intensity: 0.5 },
    },
    effects: ['snowfall'],
    startDate: new Date('2024-12-05'),
    endDate: new Date('2025-01-15'),
};

const EVENT_LAYERED: UiStylesOutput = {
    brand: { l: 0.6, c: 0.1, h: 100 },
    backdrop: { style: 'glow', intensity: 0.5, height: 1 },
    radius: '0.625rem',
};

describe('mergeUserStyles (defaults < event theme < user)', () => {
    it('returns the defaults without an event theme or user styles', () => {
        expect(mergeUserStyles(DEFAULT_STYLES, null, undefined)).toEqual(
            DEFAULT_STYLES,
        );
    });

    it('returns the defaults for an event theme without styles', () => {
        expect(
            mergeUserStyles(
                DEFAULT_STYLES,
                { ...EVENT_THEME, styles: undefined },
                {},
            ),
        ).toEqual(DEFAULT_STYLES);
    });

    it('layers an active event theme over the defaults', () => {
        expect(mergeUserStyles(DEFAULT_STYLES, EVENT_THEME, {})).toEqual(
            EVENT_LAYERED,
        );
    });

    it('lets a full user override beat the event theme', () => {
        expect(
            mergeUserStyles(DEFAULT_STYLES, EVENT_THEME, {
                brand: { l: 0.5, c: 0.2, h: 10 },
                backdrop: {
                    style: 'glow',
                    intensity: 0.4,
                    color: { l: 0.5, c: 0.2, h: 10 },
                },
                radius: '1rem',
            }),
        ).toEqual({
            brand: { l: 0.5, c: 0.2, h: 10 },
            backdrop: {
                style: 'glow',
                intensity: 0.4,
                height: 1,
                color: { l: 0.5, c: 0.2, h: 10 },
            },
            radius: '1rem',
        });
    });

    it('keeps the event theme where a partial user override is silent', () => {
        expect(
            mergeUserStyles(DEFAULT_STYLES, EVENT_THEME, { radius: '1rem' }),
        ).toEqual({ ...EVENT_LAYERED, radius: '1rem' });
    });

    it('treats null user fields as unset', () => {
        expect(
            mergeUserStyles(DEFAULT_STYLES, EVENT_THEME, {
                brand: null,
                backdrop: null,
                radius: null,
            }),
        ).toEqual(EVENT_LAYERED);
    });

    it('treats missing user styles as unset', () => {
        expect(mergeUserStyles(DEFAULT_STYLES, EVENT_THEME, undefined)).toEqual(
            EVENT_LAYERED,
        );
    });
});
