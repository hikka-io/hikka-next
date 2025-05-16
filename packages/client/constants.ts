import { PaginationArgs } from './types';

export const DEFAULT_PAGINATION: PaginationArgs = { page: 1, size: 15 };

export const DEFAULT_CACHE_CONTROL = {
    // Default cache duration of 5 minutes (300 seconds)
    defaultMaxAge: 300,

    // Path-specific cache durations (seconds)
    byPath: {
        // Cache contant details for 1 hour
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

        // Cache static content for 24 hours
        '/genres': 86400,
        '/companies/*': 86400,

        // Short cache for dynamic content
        '/schedule/*': 60,
    },

    // Never cache these paths (always fetch fresh data)
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

export const API_HOST = process.env.API_HOST || 'https://api.hikka.io';
