import { describe, expect, it } from 'vitest';

import { BREAKPOINT, maxWidth, minWidth } from './breakpoints';

describe('BREAKPOINT', () => {
    it('mirrors the Tailwind default screens', () => {
        expect(BREAKPOINT).toEqual({ sm: 640, md: 768, lg: 1024, xl: 1280 });
    });
});

describe('minWidth', () => {
    it('builds the desktop query the call sites used to spell by hand', () => {
        expect(minWidth('md')).toBe('(min-width: 768px)');
    });

    it('starts each range exactly at its breakpoint', () => {
        expect(minWidth('sm')).toBe('(min-width: 640px)');
        expect(minWidth('lg')).toBe('(min-width: 1024px)');
        expect(minWidth('xl')).toBe('(min-width: 1280px)');
    });
});

describe('maxWidth', () => {
    it('ends one pixel below the breakpoint so it never overlaps minWidth', () => {
        expect(maxWidth('md')).toBe('(max-width: 767px)');
        expect(maxWidth('sm')).toBe('(max-width: 639px)');
    });
});
