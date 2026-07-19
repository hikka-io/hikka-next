export const UI_PREFS_COOKIE = 'ui-prefs';
export const UI_PREFS_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export type UiPreferences = {
    /** View preferences by context key (e.g., 'catalog', 'userlist', 'franchise') */
    views: Record<string, Hikka.View>;
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
                ? (parsed.views as Record<string, Hikka.View>)
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

/** Client-side cookie write; the server rolling refresh re-applies domain/secure flags. */
export function writeUiPrefsCookie(value: UiPreferences) {
    if (typeof document === 'undefined') return;

    document.cookie = `${UI_PREFS_COOKIE}=${encodeURIComponent(
        JSON.stringify(value),
    )}; path=/; max-age=${UI_PREFS_MAX_AGE}; SameSite=Lax`;
}
