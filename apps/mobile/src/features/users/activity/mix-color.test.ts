import { describe, expect, it } from 'vitest';

import { mixHex } from './mix-color';

describe('mixHex', () => {
    it('returns the ends at 0 and 1', () => {
        expect(mixHex('#f5f5f8', '#a3287e', 0)).toBe('#f5f5f8');
        expect(mixHex('#f5f5f8', '#a3287e', 1)).toBe('#a3287e');
    });

    it('blends channel by channel', () => {
        expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080');
        expect(mixHex('#000000', '#ff0000', 0.25)).toBe('#400000');
    });

    it('falls back to the accent for anything but a 6-digit hex', () => {
        expect(mixHex('rgb(0 0 0)', '#a3287e', 0.5)).toBe('#a3287e');
        expect(mixHex('#000', '#a3287e', 0.5)).toBe('#a3287e');
    });
});
