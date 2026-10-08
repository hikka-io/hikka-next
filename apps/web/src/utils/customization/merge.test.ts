import { describe, expect, it } from 'vitest';

import type { UiStylesOutput } from '@hikka/api';

import { DEFAULT_STYLES } from './defaults';
import { diffStyles, mergeStyles } from './merge';

describe('diffStyles', () => {
    it('diffs only the changed brand', () => {
        expect(
            diffStyles({ ...DEFAULT_STYLES, brand: { l: 0.5, c: 0.2, h: 10 } }),
        ).toEqual({ brand: { l: 0.5, c: 0.2, h: 10 } });
    });

    it('returns undefined when nothing changed', () => {
        expect(diffStyles({ ...DEFAULT_STYLES })).toBeUndefined();
    });

    it('keeps surface overrides', () => {
        const diff = diffStyles({
            ...DEFAULT_STYLES,
            overrides: { light: { background: { l: 0.9, c: 0, h: 0 } } },
        });
        expect(diff?.overrides?.light?.background).toEqual({
            l: 0.9,
            c: 0,
            h: 0,
        });
    });
});

describe('mergeStyles', () => {
    it('fills brand from defaults when the user has none', () => {
        expect(mergeStyles(DEFAULT_STYLES, {}).brand).toEqual(
            DEFAULT_STYLES.brand,
        );
    });

    it('lets the user brand win', () => {
        const merged = mergeStyles(DEFAULT_STYLES, {
            brand: { l: 0.5, c: 0.2, h: 10 },
        });
        expect(merged.brand).toEqual({ l: 0.5, c: 0.2, h: 10 });
    });

    it('inherits the default backdrop color when the user has no backdrop', () => {
        const merged = mergeStyles(DEFAULT_STYLES, {});
        expect(merged.backdrop?.color).toEqual(DEFAULT_STYLES.backdrop?.color);
    });

    it('keeps "follow brand" (no color) instead of re-filling the default color', () => {
        const merged = mergeStyles(DEFAULT_STYLES, {
            backdrop: { style: 'glow', intensity: 0.7 },
        });
        expect(merged.backdrop?.color).toBeUndefined();
        expect(merged.backdrop?.intensity).toBe(0.7);
    });

    it('lets the user backdrop color win', () => {
        const merged = mergeStyles(DEFAULT_STYLES, {
            backdrop: {
                style: 'glow',
                intensity: 0.4,
                color: { l: 0.5, c: 0.2, h: 10 },
            },
        });
        expect(merged.backdrop?.color).toEqual({ l: 0.5, c: 0.2, h: 10 });
        expect(merged.backdrop?.intensity).toBe(0.4);
    });
});

describe('event theme layering (defaults < event < user)', () => {
    const eventStyles: UiStylesOutput = { brand: { l: 0.6, c: 0.1, h: 100 } };

    it('event brand beats defaults when the user has no brand', () => {
        const merged = mergeStyles(
            mergeStyles(DEFAULT_STYLES, eventStyles),
            {},
        );
        expect(merged.brand).toEqual({ l: 0.6, c: 0.1, h: 100 });
    });

    it('user brand beats the event theme', () => {
        const merged = mergeStyles(mergeStyles(DEFAULT_STYLES, eventStyles), {
            brand: { l: 0.5, c: 0.2, h: 10 },
        });
        expect(merged.brand).toEqual({ l: 0.5, c: 0.2, h: 10 });
    });
});
