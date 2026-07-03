import { describe, expect, it } from 'vitest';

import {
    computeRenderScale,
    mulberry32,
    randomItemWith,
    randomWith,
} from './utils';

describe('mulberry32', () => {
    it('produces identical sequences for identical seeds', () => {
        const a = mulberry32(1234);
        const b = mulberry32(1234);
        expect(Array.from({ length: 50 }, a)).toEqual(
            Array.from({ length: 50 }, b),
        );
    });

    it('produces different sequences for different seeds', () => {
        const a = mulberry32(1);
        const b = mulberry32(2);
        expect(Array.from({ length: 10 }, a)).not.toEqual(
            Array.from({ length: 10 }, b),
        );
    });

    it('stays within [0, 1)', () => {
        const rng = mulberry32(42);
        for (let i = 0; i < 1000; i++) {
            const v = rng();
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(1);
        }
    });
});

describe('randomWith / randomItemWith', () => {
    it('randomWith maps rng output into [min, max)', () => {
        expect(randomWith(() => 0, 5, 10)).toBe(5);
        expect(randomWith(() => 0.999999, 5, 10)).toBeCloseTo(10, 3);
    });

    it('randomItemWith picks deterministically from rng', () => {
        const arr = ['a', 'b', 'c'] as const;
        expect(randomItemWith(() => 0, arr)).toBe('a');
        expect(randomItemWith(() => 0.99, arr)).toBe('c');
    });
});

describe('computeRenderScale', () => {
    it('caps high-dpi devices at the max scale', () => {
        expect(computeRenderScale(3, 1.5)).toBe(1.5);
        expect(computeRenderScale(2, 2)).toBe(2);
    });

    it('passes low dpr through unchanged', () => {
        expect(computeRenderScale(1, 2)).toBe(1);
        expect(computeRenderScale(1.25, 2)).toBe(1.25);
    });

    it('never returns below 1', () => {
        expect(computeRenderScale(0.5, 2)).toBe(1);
    });
});
