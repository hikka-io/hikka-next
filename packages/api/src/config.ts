export const DEFAULT_BASE_URL = 'https://api.hikka.io';

export interface CacheControl {
    defaultMaxAge?: number;
    byPath?: Record<string, number>;
    noCache?: string[];
}

/** Ported from the previous @hikka/client constants. */
export const DEFAULT_CACHE_CONTROL: CacheControl = {
    defaultMaxAge: 300,
    byPath: {
        '/anime/*': 3600,
        '/anime/*/characters': 3600,
        '/anime/*/episodes': 3600,
        '/anime/*/recommendations': 3600,
        '/anime/*/staff': 3600,
        '/manga/*': 3600,
        '/manga/*/characters': 3600,
        '/novel/*': 3600,
        '/novel/*/characters': 3600,
        '/characters/*': 3600,
        '/characters/*/anime': 3600,
        '/characters/*/manga': 3600,
        '/characters/*/novel': 3600,
        '/characters/*/voices': 3600,
        '/people/*': 3600,
        '/people/*/anime': 3600,
        '/people/*/manga': 3600,
        '/people/*/novel': 3600,
        '/people/*/voices': 3600,
        '/genres': 86400,
        '/companies/*': 86400,
        '/schedule/*': 60,
    },
    noCache: [
        '/notifications',
        '/notifications/*',
        '/watch/*',
        '/watch/*/following',
        '/watch/*/stats',
        '/watch/random/*/*',
        '/read/*/*',
        '/read/*/*/following',
        '/read/*/*/stats',
        '/read/*/random/*/*',
        '/comments/latest',
        '/comments/list',
        '/comments/*/*/list',
        '/comments/thread/*',
        '/user/*',
        '/user/*/activity',
        '/articles/*',
    ],
};
