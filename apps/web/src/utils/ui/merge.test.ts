import { describe, expect, it } from 'vitest';

import { DEFAULT_STYLES } from './defaults';
import { diffStyles, mergeStyles, normalizeLegacyStyles } from './merge';

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

describe('normalizeLegacyStyles', () => {
    it('derives brand from legacy primary_foreground', () => {
        const n = normalizeLegacyStyles({
            light: { colors: { primary_foreground: { h: 321, s: 70, l: 65 } } },
        });
        expect(n.brand?.l).toBeCloseTo(0.69, 1);
        expect(n.brand?.h).toBeCloseTo(343, 0);
    });

    it('leaves styles that already have a brand untouched', () => {
        const styles = { brand: { l: 0.4, c: 0.1, h: 200 } };
        expect(normalizeLegacyStyles(styles)).toBe(styles);
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
});
