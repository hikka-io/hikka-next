/**
 * Query key factory functions for efficient caching with TanStack Query.
 * Each module has its own namespace to avoid key collisions.
 */

export const queryKeys = {
    // Anime module keys
    anime: {
        all: ['anime'] as const,
        search: (params: unknown) =>
            [...queryKeys.anime.all, 'search', params] as const,
        details: (slug: string) =>
            [...queryKeys.anime.all, 'details', slug] as const,
    },

    // Manga module keys
    manga: {
        all: ['manga'] as const,
    },

    // Novel module keys
    novel: {
        all: ['novel'] as const,
    },

    // User module keys
    user: {
        all: ['user'] as const,
    },

    // Collections module keys
    collections: {
        all: ['collections'] as const,
    },

    // Notifications module keys
    notifications: {
        all: ['notifications'] as const,
    },

    // Characters module keys
    characters: {
        all: ['characters'] as const,
    },

    // People module keys
    people: {
        all: ['people'] as const,
    },

    // Auth module keys
    auth: {
        all: ['auth'] as const,
    },

    // Watch module keys
    watch: {
        all: ['watch'] as const,
    },

    // Read module keys
    read: {
        all: ['read'] as const,
    },

    // Favourite module keys
    favourite: {
        all: ['favourite'] as const,
    },

    // Comments module keys
    comments: {
        all: ['comments'] as const,
    },

    // Follow module keys
    follow: {
        all: ['follow'] as const,
    },

    // Vote module keys
    vote: {
        all: ['vote'] as const,
    },

    // History module keys
    history: {
        all: ['history'] as const,
    },

    // Schedule module keys
    schedule: {
        all: ['schedule'] as const,
    },

    // Stats module keys
    stats: {
        all: ['stats'] as const,
    },

    // Genres module keys
    genres: {
        all: ['genres'] as const,
    },

    // Companies module keys
    companies: {
        all: ['companies'] as const,
    },

    // Related module keys
    related: {
        all: ['related'] as const,
    },

    // Articles module keys
    articles: {
        all: ['articles'] as const,
    },

    // Edit module keys
    edit: {
        all: ['edit'] as const,
    },

    // Settings module keys
    settings: {
        all: ['settings'] as const,
        ignoredNotifications: () =>
            [...queryKeys.settings.all, 'ignored-notifications'] as const,
    },
};
