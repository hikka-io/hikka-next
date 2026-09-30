import { COOKIE } from './constants';
import { writeHostCookie } from './ui-cookie';

export type View = 'table' | 'grid' | 'list';

export const CATALOG_FILTERS_SIDEBAR_KEY = 'catalog_filters_sidebar';

export type UiPreferences = {
    /** View preferences by context key (e.g., 'catalog', 'userlist', 'franchise') */
    views: Record<string, View>;
    /** Filter preferences by context key (e.g., 'franchiseContentTypes') */
    filters: Record<string, string[]>;
    /** Collapsible state by context key (e.g., 'catalog_filters_sidebar') */
    collapsibles: Record<string, boolean>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/** Parse the raw cookie value; malformed input yields null, never throws. */
export function parseUiPrefs(
    raw: string | null | undefined,
): UiPreferences | null {
    if (!raw) return null;

    try {
        const parsed: unknown = JSON.parse(decodeURIComponent(raw));
        if (!isRecord(parsed)) return null;

        return {
            views: isRecord(parsed.views)
                ? (parsed.views as Record<string, View>)
                : {},
            filters: isRecord(parsed.filters)
                ? (parsed.filters as Record<string, string[]>)
                : {},
            collapsibles: isRecord(parsed.collapsibles)
                ? (parsed.collapsibles as Record<string, boolean>)
                : {},
        };
    } catch {
        return null;
    }
}

/** Host-only write; the browser is the sole writer, see `ui-cookie.ts`. */
export function writeUiPrefsCookie(value: UiPreferences) {
    writeHostCookie(COOKIE.uiPrefs, JSON.stringify(value));
}
