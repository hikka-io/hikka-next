import { describe, expect, it } from 'vitest';

import { stylesToCSS } from './inject-styles';

describe('stylesToCSS', () => {
    it('emits the brand seed at :root:root', () => {
        const css = stylesToCSS({ brand: { l: 0.6, c: 0.2, h: 20 } });
        expect(css).toContain(':root:root');
        expect(css).toContain('--brand: oklch(0.6 0.2 20)');
    });

    it('emits light and dark surface overrides', () => {
        const css = stylesToCSS({
            overrides: {
                light: { background: { l: 1, c: 0, h: 0 } },
                dark: { muted: { l: 0.3, c: 0, h: 0 } },
            },
        });
        expect(css).toContain('--background: oklch(1 0 0)');
        expect(css).toMatch(/\.dark\.dark \{[\s\S]*--muted: oklch\(0\.3 0 0\)/);
    });

    it('ignores non-surface / brand-derived override keys', () => {
        const css = stylesToCSS({
            overrides: {
                light: { primary: { l: 0.5, c: 0.2, h: 20 } } as never,
            },
        });
        expect(css).not.toContain('--primary:');
    });

    it('drops out-of-range oklch values', () => {
        const css = stylesToCSS({ brand: { l: 5, c: 0.2, h: 20 } });
        expect(css).not.toContain('--brand:');
    });

    it('emits radius', () => {
        expect(stylesToCSS({ radius: '0.5rem' })).toContain('--radius: 0.5rem');
    });

    it('returns empty string for empty styles', () => {
        expect(stylesToCSS({})).toBe('');
    });
});
