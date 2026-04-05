/**
 * Utilities for merging UI styles and effects.
 */
import {
    HSLColor,
    UIColorTokens,
    UIEffect,
    UIPreferences,
    UIStyles,
    UIThemeStyles,
    UserUI,
} from '@hikka/client';

import { getActiveEventTheme } from '@/utils/constants/event-themes';

import { DEFAULT_STYLES, DEFAULT_USER_UI } from './defaults';
import { ALLOWED_COLOR_TOKENS } from './inject-styles';

/**
 * Strip null/undefined values from an object so they don't overwrite
 * base values during spread. The API returns null for unset fields.
 */
function stripNulls<T extends Record<string, unknown>>(
    obj: T | undefined | null,
): Partial<T> | undefined {
    if (!obj) return undefined;

    const result: Record<string, unknown> = {};
    let hasValues = false;

    for (const [key, value] of Object.entries(obj)) {
        if (value != null) {
            result[key] = value;
            hasValues = true;
        }
    }

    return hasValues ? (result as Partial<T>) : undefined;
}

/**
 * Merge two UIStyles objects, with override taking precedence.
 * Null values in override are treated as "not set" and fall through to base.
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
        ...stripNulls(override),
        light: {
            ...base.light,
            ...stripNulls(override.light),
            colors: {
                ...base.light?.colors,
                ...stripNulls(override.light?.colors),
            },
            body: {
                ...base.light?.body,
                ...stripNulls(override.light?.body),
            },
        },
        dark: {
            ...base.dark,
            ...stripNulls(override.dark),
            colors: {
                ...base.dark?.colors,
                ...stripNulls(override.dark?.colors),
            },
            body: {
                ...base.dark?.body,
                ...stripNulls(override.dark?.body),
            },
        },
        radius: override.radius ?? base.radius,
    };
}

/**
 * Merge event theme effects with the user's singular effect, deduplicating.
 */
export function mergeEffects(
    eventEffects: UIEffect[] | undefined,
    userEffect: UIEffect | null | undefined,
): UIEffect[] {
    const combined = [...(eventEffects ?? [])];
    if (userEffect) combined.push(userEffect);
    return [...new Set(combined)];
}

/**
 * Merge two UIPreferences objects, with override taking precedence.
 */
export function mergePreferences(
    base: UIPreferences | undefined,
    override: Partial<UIPreferences> | undefined,
): UIPreferences {
    if (!base && !override) return DEFAULT_USER_UI.preferences;
    if (!base) return { ...DEFAULT_USER_UI.preferences, ...override };
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

function hslEqual(a: HSLColor | undefined, b: HSLColor | undefined): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.h === b.h && a.s === b.s && a.l === b.l;
}

function diffColorTokens(
    tokens: UIColorTokens | undefined,
    defaults: UIColorTokens | undefined,
): UIColorTokens | undefined {
    if (!tokens) return undefined;
    if (!defaults) return tokens;

    const result: UIColorTokens = {};
    let hasOverrides = false;

    for (const [key, value] of Object.entries(tokens)) {
        if (!ALLOWED_COLOR_TOKENS.has(key as keyof UIColorTokens)) continue;
        const defaultValue = defaults[key as keyof UIColorTokens];
        if (!hslEqual(value, defaultValue)) {
            (result as Record<string, HSLColor | undefined>)[key] = value;
            hasOverrides = true;
        }
    }

    return hasOverrides ? result : undefined;
}

function diffThemeStyles(
    theme: UIThemeStyles | undefined,
    defaults: UIThemeStyles | undefined,
): UIThemeStyles | undefined {
    if (!theme) return undefined;

    const colors = diffColorTokens(theme.colors, defaults?.colors);
    const body =
        JSON.stringify(theme.body) !== JSON.stringify(defaults?.body)
            ? theme.body
            : undefined;

    if (!colors && !body) return undefined;

    const result: UIThemeStyles = {};
    if (colors) result.colors = colors;
    if (body) result.body = body;
    return result;
}

/**
 * Diff styles against DEFAULT_STYLES, returning only overrides.
 * Use before saving to the API so only changed tokens are persisted.
 * On read, mergeStyles(DEFAULT_STYLES, sparseConfig) fills in the rest.
 */
export function diffStyles(styles: UIStyles | undefined): UIStyles | undefined {
    if (!styles) return undefined;

    const light = diffThemeStyles(styles.light, DEFAULT_STYLES.light);
    const dark = diffThemeStyles(styles.dark, DEFAULT_STYLES.dark);
    const radius =
        styles.radius !== DEFAULT_STYLES.radius ? styles.radius : undefined;

    if (!light && !dark && !radius) return undefined;

    const result: UIStyles = {};
    if (light) result.light = light;
    if (dark) result.dark = dark;
    if (radius) result.radius = radius;
    return result;
}

/**
 * Merge user UI with the currently active event theme (if any).
 * Single canonical source for event theme merging — use this instead of
 * calling getActiveEventTheme() + mergeStyles/mergeEffects separately.
 */
export function mergeWithEventTheme(userUI: UserUI): {
    mergedStyles: UIStyles;
    activeEffects: UIEffect[];
} {
    const eventTheme = getActiveEventTheme();
    return {
        mergedStyles: mergeStyles(eventTheme?.styles, userUI.styles),
        activeEffects: mergeEffects(
            eventTheme?.effects,
            userUI.preferences?.effect,
        ),
    };
}
