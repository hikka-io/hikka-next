/**
 * Utilities for merging UI styles and effects.
 */

import type {
    OklchColor,
    UiBackdrop,
    UiPreferencesOutput,
    UiStylesOutput,
    UiSurfaceOverrides,
    UserCustomizationResponse,
} from '@hikka/api';

import { oklchEqual } from './color';
import { DEFAULT_STYLES, DEFAULT_USER_UI } from './defaults';
import { SURFACE_OVERRIDE_TOKENS } from './inject-styles';

type UIEffect = NonNullable<UiPreferencesOutput['effect']>;

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

function mergeOverrideMaps(
    base: UiSurfaceOverrides | null | undefined,
    override: UiSurfaceOverrides | null | undefined,
): UiSurfaceOverrides | undefined {
    const merged = { ...base, ...stripNulls(override) };
    return Object.keys(merged).length > 0
        ? (merged as UiSurfaceOverrides)
        : undefined;
}

/**
 * Merge two UiStylesOutput objects, with override taking precedence.
 * Null values in override are treated as "not set" and fall through to base.
 */
export function mergeStyles(
    base: UiStylesOutput | undefined,
    override: UiStylesOutput | undefined,
): UiStylesOutput {
    if (!base && !override) return {};
    if (!base) return override ?? {};
    if (!override) return base;

    const light = mergeOverrideMaps(
        base.overrides?.light,
        override.overrides?.light,
    );
    const dark = mergeOverrideMaps(
        base.overrides?.dark,
        override.overrides?.dark,
    );

    const result: UiStylesOutput = {
        ...base,
        ...stripNulls(override),
        brand: override.brand ?? base.brand,
        radius: override.radius ?? base.radius,
    };

    const backdrop = { ...base.backdrop, ...stripNulls(override.backdrop) };
    if (Object.keys(backdrop).length > 0) {
        result.backdrop = backdrop as UiBackdrop;
    }

    if (light || dark) {
        result.overrides = {
            ...(light ? { light } : {}),
            ...(dark ? { dark } : {}),
        };
    }

    return result;
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
 * Merge two UiPreferencesOutput objects, with override taking precedence.
 */
export function mergePreferences(
    base: UiPreferencesOutput | undefined,
    override: Partial<UiPreferencesOutput> | undefined,
): UiPreferencesOutput {
    if (!base && !override) return DEFAULT_USER_UI.preferences;
    if (!base) return { ...DEFAULT_USER_UI.preferences, ...override };
    if (!override) return base;

    return {
        ...base,
        ...override,
        // Deep-merge `feed` so a partial override (e.g. only `only_followed`)
        // doesn't drop the `widgets` array coming from the base/defaults.
        feed: { ...base.feed, ...override.feed },
    };
}

/**
 * Merge two UserCustomizationResponse objects, with override taking precedence.
 */
export function mergeUserUI(
    base: UserCustomizationResponse | undefined,
    override: UserCustomizationResponse | undefined,
): UserCustomizationResponse {
    if (!base && !override) return DEFAULT_USER_UI;
    if (!base) return override ?? DEFAULT_USER_UI;
    if (!override) return base;

    return {
        ...base,
        ...override,
        styles: mergeStyles(base.styles, override.styles),
        preferences: mergePreferences(base.preferences, override.preferences),
    };
}

function backdropEqual(
    a: UiBackdrop | null | undefined,
    b: UiBackdrop | null | undefined,
): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return (
        a.style === b.style &&
        a.intensity === b.intensity &&
        oklchEqual(a.color, b.color)
    );
}

function cleanOverrideMap(
    overrides: UiSurfaceOverrides | null | undefined,
): UiSurfaceOverrides | undefined {
    if (!overrides) return undefined;
    const result: Record<string, OklchColor> = {};
    let has = false;
    for (const [key, value] of Object.entries(overrides)) {
        if (!SURFACE_OVERRIDE_TOKENS.has(key as keyof UiSurfaceOverrides)) {
            continue;
        }
        if (value == null) continue;
        result[key] = value;
        has = true;
    }
    return has ? (result as UiSurfaceOverrides) : undefined;
}

/**
 * Diff styles against DEFAULT_STYLES, returning only overrides.
 * Use before saving to the API so only changed fields are persisted.
 * On read, mergeStyles(DEFAULT_STYLES, sparseConfig) fills in the rest.
 */
export function diffStyles(
    styles: UiStylesOutput | undefined,
): UiStylesOutput | undefined {
    if (!styles) return undefined;

    const result: UiStylesOutput = {};

    if (styles.brand && !oklchEqual(styles.brand, DEFAULT_STYLES.brand)) {
        result.brand = styles.brand;
    }
    if (styles.radius && styles.radius !== DEFAULT_STYLES.radius) {
        result.radius = styles.radius;
    }
    if (
        styles.backdrop &&
        !backdropEqual(styles.backdrop, DEFAULT_STYLES.backdrop)
    ) {
        result.backdrop = styles.backdrop;
    }

    const light = cleanOverrideMap(styles.overrides?.light);
    const dark = cleanOverrideMap(styles.overrides?.dark);
    if (light || dark) {
        result.overrides = {
            ...(light ? { light } : {}),
            ...(dark ? { dark } : {}),
        };
    }

    return Object.keys(result).length > 0 ? result : undefined;
}
