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
        characters: (slug: string) =>
            [...queryKeys.anime.all, 'characters', slug] as const,
        staff: (slug: string) =>
            [...queryKeys.anime.all, 'staff', slug] as const,
        episodes: (slug: string) =>
            [...queryKeys.anime.all, 'episodes', slug] as const,
        recommendations: (slug: string) =>
            [...queryKeys.anime.all, 'recommendations', slug] as const,
        franchise: (slug: string) =>
            [...queryKeys.anime.all, 'franchise', slug] as const,
        genres: () => [...queryKeys.anime.all, 'genres'] as const,
    },

    // Manga module keys
    manga: {
        all: ['manga'] as const,
        search: (params: unknown) =>
            [...queryKeys.manga.all, 'search', params] as const,
        details: (slug: string) =>
            [...queryKeys.manga.all, 'details', slug] as const,
        characters: (slug: string) =>
            [...queryKeys.manga.all, 'characters', slug] as const,
    },

    // Novel module keys
    novel: {
        all: ['novel'] as const,
        search: (params: unknown) =>
            [...queryKeys.novel.all, 'search', params] as const,
        details: (slug: string) =>
            [...queryKeys.novel.all, 'details', slug] as const,
        characters: (slug: string) =>
            [...queryKeys.novel.all, 'characters', slug] as const,
    },

    // User module keys
    user: {
        all: ['user'] as const,
        me: () => [...queryKeys.user.all, 'me'] as const,
        profile: (username: string) =>
            [...queryKeys.user.all, 'profile', username] as const,
        activity: (username: string) =>
            [...queryKeys.user.all, 'activity', username] as const,
        search: (query: string) =>
            [...queryKeys.user.all, 'search', query] as const,
        exportLists: () => [...queryKeys.user.all, 'export-lists'] as const,
    },

    // Collections module keys
    collections: {
        all: ['collections'] as const,
        list: (params: unknown) =>
            [...queryKeys.collections.all, 'list', params] as const,
        details: (reference: string) =>
            [...queryKeys.collections.all, 'details', reference] as const,
    },

    // Notifications module keys
    notifications: {
        all: ['notifications'] as const,
        list: () => [...queryKeys.notifications.all, 'list'] as const,
        unseenCount: () =>
            [...queryKeys.notifications.all, 'unseen-count'] as const,
        markAsSeen: (reference: string) =>
            [
                ...queryKeys.notifications.all,
                'mark-as-seen',
                reference,
            ] as const,
    },

    // Characters module keys
    characters: {
        all: ['characters'] as const,
        details: (slug: string) =>
            [...queryKeys.characters.all, 'details', slug] as const,
        search: (query: string) =>
            [...queryKeys.characters.all, 'search', query] as const,
        anime: (slug: string) =>
            [...queryKeys.characters.all, 'anime', slug] as const,
        manga: (slug: string) =>
            [...queryKeys.characters.all, 'manga', slug] as const,
        novel: (slug: string) =>
            [...queryKeys.characters.all, 'novel', slug] as const,
        voices: (slug: string) =>
            [...queryKeys.characters.all, 'voices', slug] as const,
    },

    // People module keys
    people: {
        all: ['people'] as const,
        details: (slug: string) =>
            [...queryKeys.people.all, 'details', slug] as const,
        search: (query: string) =>
            [...queryKeys.people.all, 'search', query] as const,
        anime: (slug: string) =>
            [...queryKeys.people.all, 'anime', slug] as const,
        manga: (slug: string) =>
            [...queryKeys.people.all, 'manga', slug] as const,
        novel: (slug: string) =>
            [...queryKeys.people.all, 'novel', slug] as const,
        characters: (slug: string) =>
            [...queryKeys.people.all, 'characters', slug] as const,
    },

    // Auth module keys
    auth: {
        all: ['auth'] as const,
        tokenInfo: () => [...queryKeys.auth.all, 'token-info'] as const,
        thirdPartyTokens: (params: unknown) =>
            [...queryKeys.auth.all, 'third-party-tokens', params] as const,
    },

    // Watch module keys
    watch: {
        all: ['watch'] as const,
        get: (slug: string) => [...queryKeys.watch.all, 'get', slug] as const,
        list: (username: string, params: unknown) =>
            [...queryKeys.watch.all, 'list', username, params] as const,
        stats: (username: string) =>
            [...queryKeys.watch.all, 'stats', username] as const,
        following: (slug: string) =>
            [...queryKeys.watch.all, 'following', slug] as const,
    },

    // Read module keys
    read: {
        all: ['read'] as const,
        get: (contentType: string, slug: string) =>
            [...queryKeys.read.all, 'get', contentType, slug] as const,
        list: (contentType: string, username: string, params: unknown) =>
            [
                ...queryKeys.read.all,
                'list',
                contentType,
                username,
                params,
            ] as const,
        stats: (contentType: string, username: string) =>
            [...queryKeys.read.all, 'stats', contentType, username] as const,
        following: (contentType: string, slug: string) =>
            [...queryKeys.read.all, 'following', contentType, slug] as const,
    },

    // Favourite module keys
    favourite: {
        all: ['favourite'] as const,
        get: (contentType: string, slug: string) =>
            [...queryKeys.favourite.all, 'get', contentType, slug] as const,
        list: (contentType: string, username: string) =>
            [
                ...queryKeys.favourite.all,
                'list',
                contentType,
                username,
            ] as const,
    },

    // Comments module keys
    comments: {
        all: ['comments'] as const,
        latest: () => [...queryKeys.comments.all, 'latest'] as const,
        list: () => [...queryKeys.comments.all, 'list'] as const,
        content: (contentType: string, slug: string) =>
            [...queryKeys.comments.all, 'content', contentType, slug] as const,
        thread: (reference: string) =>
            [...queryKeys.comments.all, 'thread', reference] as const,
    },

    // Follow module keys
    follow: {
        all: ['follow'] as const,
        check: (username: string) =>
            [...queryKeys.follow.all, 'check', username] as const,
        stats: (username: string) =>
            [...queryKeys.follow.all, 'stats', username] as const,
        followers: (username: string) =>
            [...queryKeys.follow.all, 'followers', username] as const,
        following: (username: string) =>
            [...queryKeys.follow.all, 'following', username] as const,
    },

    // Vote module keys
    vote: {
        all: ['vote'] as const,
        get: (contentType: string, slug: string) =>
            [...queryKeys.vote.all, 'get', contentType, slug] as const,
    },

    // History module keys
    history: {
        all: ['history'] as const,
        following: () => [...queryKeys.history.all, 'following'] as const,
        user: (username: string) =>
            [...queryKeys.history.all, 'user', username] as const,
    },

    // Schedule module keys
    schedule: {
        all: ['schedule'] as const,
        anime: (args: unknown) =>
            [...queryKeys.schedule.all, 'anime', args] as const,
    },

    // Stats module keys
    stats: {
        all: ['stats'] as const,
        editsTop: () => [...queryKeys.stats.all, 'edits-top'] as const,
    },

    // Genres module keys
    genres: {
        all: ['genres'] as const,
        list: () => [...queryKeys.genres.all, 'list'] as const,
    },

    // Companies module keys
    companies: {
        all: ['companies'] as const,
        search: (args: unknown) =>
            [...queryKeys.companies.all, 'search', args] as const,
    },

    // Related module keys
    related: {
        all: ['related'] as const,
        franchise: (contentType: string, slug: string) =>
            [...queryKeys.related.all, 'franchise', contentType, slug] as const,
    },

    // Articles module keys
    articles: {
        all: ['articles'] as const,
        list: (args: unknown) =>
            [...queryKeys.articles.all, 'list', args] as const,
        details: (slug: string) =>
            [...queryKeys.articles.all, 'details', slug] as const,
        stats: () => [...queryKeys.articles.all, 'stats'] as const,
    },

    // Edit module keys
    edit: {
        all: ['edit'] as const,
        list: (args: unknown) => [...queryKeys.edit.all, 'list', args] as const,
        details: (editId: string | number) =>
            [...queryKeys.edit.all, 'details', editId.toString()] as const,
    },

    // Settings module keys
    settings: {
        all: ['settings'] as const,
        ignoredNotifications: () =>
            [...queryKeys.settings.all, 'ignored-notifications'] as const,
    },
};
