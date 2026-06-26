import type { CacheControl } from './config';

function matchesPattern(pattern: string, path: string): boolean {
    if (pattern.includes('*')) {
        return new RegExp(`^${pattern.replace(/\*/g, '.*')}$`).test(path);
    }
    return pattern === path;
}

export function shouldNoCache(path: string, cc: CacheControl): boolean {
    return cc.noCache?.some((p) => matchesPattern(p, path)) ?? false;
}

export function cacheControlHeadersFor(
    path: string,
    cc: CacheControl,
): Record<string, string> | null {
    if (shouldNoCache(path, cc)) {
        return {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
        };
    }

    let maxAge: number | undefined;
    if (cc.byPath) {
        for (const [pattern, age] of Object.entries(cc.byPath)) {
            if (matchesPattern(pattern, path)) {
                maxAge = age;
                break;
            }
        }
    }
    if (maxAge === undefined) maxAge = cc.defaultMaxAge;

    return maxAge === undefined
        ? null
        : { 'Cache-Control': `max-age=${maxAge}` };
}
