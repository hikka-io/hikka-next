/**
 * Utilities for merging appearance styles and effects.
 */
import {
    UIEffect,
    UIPreferences,
    UIStyles,
    UserAppearance,
} from '@hikka/client';

import { DEFAULT_APPEARANCE } from './defaults';

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
        ...base,
        ...override,
        light: {
            ...base.light,
            ...override.light,
            colors: {
                ...base.light?.colors,
                ...override.light?.colors,
            },
        },
        dark: {
            ...base.dark,
            ...override.dark,
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

/**
 * Merge two UIPreferences objects, with override taking precedence.
 */
export function mergePreferences(
    base: UIPreferences | undefined,
    override: UIPreferences | undefined,
): UIPreferences {
    if (!base && !override) return {};
    if (!base) return override!;
    if (!override) return base;

    return {
        ...base,
        ...override,
    };
}

/**
 * Merge two UserAppearance objects, with override taking precedence.
 */

export function mergeUserUI(
    base: UserAppearance | undefined,
    override: UserAppearance | undefined,
): UserAppearance {
    if (!base && !override) return DEFAULT_APPEARANCE;
    if (!base) return override!;
    if (!override) return base;

    return {
        ...base,
        ...override,
        styles: mergeStyles(base.styles, override.styles),
        preferences: mergePreferences(base.preferences, override.preferences),
    };
}
