import { describe, expect, it } from 'vitest';

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
});
