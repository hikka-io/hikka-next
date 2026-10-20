import type { OklchColor } from '@hikka/api';

import { DEFAULT_BRAND } from './customization-defaults';
import { oklchToHex } from './oklch';

export type BrandTokens = Record<
    | '--color-brand'
    | '--color-primary'
    | '--color-primary-foreground'
    | '--color-primary-border',
    string
>;

/** The lightness and chroma factors of globals.css's brand-derived primary trio, per scheme. */
const PRIMARY_TRIO = {
    light: {
        primary: { l: 0.95, c: 0.19 },
        foreground: { l: 0.5, c: 1 },
        border: { l: 0.9, c: 0.35 },
    },
    dark: {
        primary: { l: 0.156, c: 0.04 },
        foreground: { l: 0.722, c: 1 },
        border: { l: 0.277, c: 0.38 },
    },
} as const;

const derive = (
    brand: OklchColor,
    { l, c }: { l: number; c: number },
): string => oklchToHex({ l, c: brand.c * c, h: brand.h });

/** Hex tokens for a brand seed, the runtime equivalent of what the mobile token generator resolves from the web CSS. */
export function brandTokens(
    brand: OklchColor = DEFAULT_BRAND,
): Record<'light' | 'dark', BrandTokens> {
    const tokens = (scheme: keyof typeof PRIMARY_TRIO): BrandTokens => ({
        '--color-brand': oklchToHex(brand),
        '--color-primary': derive(brand, PRIMARY_TRIO[scheme].primary),
        '--color-primary-foreground': derive(
            brand,
            PRIMARY_TRIO[scheme].foreground,
        ),
        '--color-primary-border': derive(brand, PRIMARY_TRIO[scheme].border),
    });

    return { light: tokens('light'), dark: tokens('dark') };
}
