/**
 * Utilities for merging UI styles and effects.
 */
import { UIEffect, UIPreferences, UIStyles, UserUI } from '@hikka/client';

import { DEFAULT_USER_UI } from './defaults';

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
            body: {
                ...base.light?.body,
                ...override.light?.body,
            },
        },
        dark: {
            ...base.dark,
            ...override.dark,
            colors: {
                ...base.dark?.colors,
                ...override.dark?.colors,
            },
            body: {
                ...base.dark?.body,
                ...override.dark?.body,
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
 * Merge two UserUI objects, with override taking precedence.
 */

export function mergeUserUI(
    base: UserUI | undefined,
    override: UserUI | undefined,
): UserUI {
    if (!base && !override) return DEFAULT_USER_UI;
    if (!base) return override!;
    if (!override) return base;

    return {
        ...base,
        ...override,
        styles: mergeStyles(base.styles, override.styles),
        preferences: mergePreferences(base.preferences, override.preferences),
    };
}
