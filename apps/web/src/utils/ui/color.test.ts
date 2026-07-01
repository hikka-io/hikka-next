import { describe, expect, it } from 'vitest';

import {
    hexToOklch,
    hslToOklch,
    isValidOklch,
    oklchToCss,
    oklchToHex,
} from './color';

describe('oklch helpers', () => {
    it('formats oklch css without trailing zeros', () => {
        expect(oklchToCss({ l: 0.7, c: 0.18, h: 343 })).toBe(
            'oklch(0.7 0.18 343)',
        );
    });

    it('validates ranges', () => {
        expect(isValidOklch({ l: 0.5, c: 0.1, h: 200 })).toBe(true);
        expect(isValidOklch({ l: 2, c: 0.1, h: 200 })).toBe(false);
        expect(isValidOklch({ l: 0.5, c: 0.9, h: 200 })).toBe(false);
        expect(isValidOklch({ l: 0.5, c: 0.1, h: 400 })).toBe(false);
        expect(
            isValidOklch({ l: Number.NaN, c: 0.1, h: 200 } as never),
        ).toBe(false);
    });

    it('converts the brand hsl to oklch near target', () => {
        const o = hslToOklch({ h: 321, s: 70, l: 65 });
        expect(o.l).toBeCloseTo(0.69, 1);
        expect(o.c).toBeCloseTo(0.18, 1);
        expect(o.h).toBeCloseTo(343, 0);
    });

    it('bridges hex and oklch', () => {
        const white = hexToOklch('#ffffff');
        expect(white?.l).toBeCloseTo(1, 2);
        expect(white?.c).toBeCloseTo(0, 2);
        expect(oklchToHex({ l: 0, c: 0, h: 0 })).toBe('#000000');
        expect(oklchToHex({ l: 1, c: 0, h: 0 })).toBe('#FFFFFF');
    });

    it('returns null for invalid hex', () => {
        expect(hexToOklch('nope')).toBeNull();
    });
});
