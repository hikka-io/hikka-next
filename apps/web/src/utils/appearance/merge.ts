/**
 * Utilities for merging appearance styles and effects.
 */
import { UIEffect, UIStyles } from '@hikka/client';

/**
 * Merge two UIStyles objects, with override taking precedence.
 */
export function mergeStyles(
    base: UIStyles | undefined,
    override: UIStyles | undefined,
): UIStyles {
    if (!base && !override) return {};
    if (!base) return override!;
    if (!override) return base;

    return {
        light: {
            colors: {
                ...base.light?.colors,
                ...override.light?.colors,
            },
        },
        dark: {
            colors: {
                ...base.dark?.colors,
                ...override.dark?.colors,
            },
        },
        radius: override.radius ?? base.radius,
    };
}

/**
 * Merge two effect arrays, deduplicating the result.
 */
export function mergeEffects(
    base: UIEffect[] | undefined,
    override: UIEffect[] | undefined,
): UIEffect[] {
    const combined = [...(base ?? []), ...(override ?? [])];
    return [...new Set(combined)];
}
