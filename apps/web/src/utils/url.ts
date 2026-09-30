import { isServer } from '@/utils/is-server';

export const SITE_ORIGIN = 'https://hikka.io';

export const getPublicSiteUrl = (): string =>
    import.meta.env.VITE_SITE_URL || SITE_ORIGIN;

/** Resolves the absolute site URL with environment fallback. */
export const getSiteUrl = (): string => {
    if (import.meta.env.VITE_SITE_URL) return import.meta.env.VITE_SITE_URL;
    if (!isServer()) return window.location.origin;
    return 'http://localhost:3000';
};

export const resolveSameOriginUrl = (
    target: string,
    base: string,
): URL | null => {
    try {
        const url = new URL(target, base);

        return url.origin === new URL(base).origin ? url : null;
    } catch {
        return null;
    }
};

/**
 * Sanitizes a redirect URL to prevent open-redirect attacks: only same-origin
 * paths pass through; anything invalid or external falls back to '/'.
 */
export const validateRedirectUrl = (url: string): string => {
    const parsed = resolveSameOriginUrl(url, window.location.origin);

    return parsed ? parsed.pathname + parsed.search : '/';
};
