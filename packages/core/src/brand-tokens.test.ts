import { describe, expect, it } from 'vitest';

import { brandTokens } from './brand-tokens';
import { DEFAULT_BRAND } from './customization-defaults';

const channels = (hex: string) =>
    [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

const expectClose = (actual: string, expected: string) => {
    const a = channels(actual);
    const e = channels(expected);

    for (const [i, value] of a.entries()) {
        expect(Math.abs(value - e[i])).toBeLessThanOrEqual(2);
    }
};

// Hex values the mobile token generator resolves from the web CSS for the default brand (src/theme.css).
describe('brandTokens', () => {
    const tokens = brandTokens(DEFAULT_BRAND);

    it('matches the generated light tokens', () => {
        expectClose(tokens.light['--color-primary'], '#ffe6f5');
        expectClose(tokens.light['--color-primary-foreground'], '#a3287e');
        expectClose(tokens.light['--color-primary-border'], '#fdcee9');
        expectClose(tokens.light['--color-brand'], '#e76abb');
    });

    it('matches the generated dark tokens', () => {
        expectClose(tokens.dark['--color-primary'], '#0f0b0d');
        expectClose(tokens.dark['--color-primary-foreground'], '#ef71c3');
        expectClose(tokens.dark['--color-primary-border'], '#3e1931');
        expectClose(tokens.dark['--color-brand'], '#e76abb');
    });

    it('follows the hue of another brand', () => {
        const blue = brandTokens({ l: 0.676, c: 0.126, h: 259.5 });

        const [r, , b] = channels(blue.light['--color-primary-foreground']);
        expect(b).toBeGreaterThan(r);
    });
});
