/** Resolves the absolute site URL with environment fallback. */
export const getSiteUrl = (): string => {
    if (import.meta.env.VITE_SITE_URL) return import.meta.env.VITE_SITE_URL;
    if (typeof window !== 'undefined') return window.location.origin;
    return 'http://localhost:3000';
};

/**
 * Sanitizes a redirect URL to prevent open-redirect attacks: only same-origin
 * paths pass through; anything invalid or external falls back to '/'.
 */
export const validateRedirectUrl = (url: string): string => {
    try {
        const parsed = new URL(url, window.location.origin);

        if (parsed.origin === window.location.origin) {
            return parsed.pathname + parsed.search;
        }
    } catch (e) {
        console.error(e);
    }

    return '/';
};
