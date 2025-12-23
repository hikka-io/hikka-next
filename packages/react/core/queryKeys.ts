/**
 * Query key factory functions for efficient caching with TanStack Query.
 * Each module has its own namespace to avoid key collisions.
 */
import { PaginationArgs } from '@hikka/client';

export const queryKeys = {
    // Anime module keys
    anime: {
        all: ['anime'] as const,
        search: (params: unknown) =>
            [...queryKeys.anime.all, 'search', params] as const,
        details: (slug: string) =>
            [...queryKeys.anime.all, 'details', slug] as const,
        characters: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.anime.all,
                'characters',
                slug,
                paginationArgs,
            ] as const,
        staff: (slug: string, paginationArgs?: PaginationArgs) =>
            [...queryKeys.anime.all, 'staff', slug, paginationArgs] as const,
        episodes: (slug: string, paginationArgs?: PaginationArgs) =>
            [...queryKeys.anime.all, 'episodes', slug, paginationArgs] as const,
        recommendations: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.anime.all,
                'recommendations',
                slug,
                paginationArgs,
            ] as const,
        franchise: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.anime.all,
                'franchise',
                slug,
                paginationArgs,
            ] as const,
        genres: () => [...queryKeys.anime.all, 'genres'] as const,
    },

    // Manga module keys
    manga: {
        all: ['manga'] as const,
        search: (params: unknown) =>
            [...queryKeys.manga.all, 'search', params] as const,
        details: (slug: string) =>
            [...queryKeys.manga.all, 'details', slug] as const,
        characters: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.manga.all,
                'characters',
                slug,
                paginationArgs,
            ] as const,
    },

    // Novel module keys
    novel: {
        all: ['novel'] as const,
        search: (params: unknown) =>
            [...queryKeys.novel.all, 'search', params] as const,
        details: (slug: string) =>
            [...queryKeys.novel.all, 'details', slug] as const,
        characters: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.novel.all,
                'characters',
                slug,
                paginationArgs,
            ] as const,
    },

    // User module keys
    user: {
        all: ['user'] as const,
        me: () => [...queryKeys.user.all, 'me'] as const,
        byUsername: (username: string) =>
            [...queryKeys.user.all, 'details', username] as const,
        ui: (username: string) =>
            [...queryKeys.user.all, 'ui', username] as const,
        search: (args: unknown) =>
            [...queryKeys.user.all, 'search', args] as const,
        activity: (username: string) =>
            [...queryKeys.user.all, 'activity', username] as const,
    },

    // Collections module keys
    collections: {
        all: ['collections'] as const,
        list: (args: unknown, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.collections.all,
                'list',
                args,
                paginationArgs,
            ] as const,
        byReference: (reference: string) =>
            [...queryKeys.collections.all, 'reference', reference] as const,
    },

    // Notifications module keys
    notifications: {
        all: ['notifications'] as const,
        list: (paginationArgs?: PaginationArgs) =>
            [...queryKeys.notifications.all, 'list', paginationArgs] as const,
        unseenCount: () =>
            [...queryKeys.notifications.all, 'unseen-count'] as const,
    },

    // Characters module keys
    characters: {
        all: ['characters'] as const,
        search: (args: unknown, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.characters.all,
                'search',
                args,
                paginationArgs,
            ] as const,
        bySlug: (slug: string) =>
            [...queryKeys.characters.all, 'details', slug] as const,
        anime: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.characters.all,
                'anime',
                slug,
                paginationArgs,
            ] as const,
        manga: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.characters.all,
                'manga',
                slug,
                paginationArgs,
            ] as const,
        novel: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.characters.all,
                'novel',
                slug,
                paginationArgs,
            ] as const,
        voices: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.characters.all,
                'voices',
                slug,
                paginationArgs,
            ] as const,
    },

    // People module keys
    people: {
        all: ['people'] as const,
        search: (args: unknown, paginationArgs?: PaginationArgs) =>
            [...queryKeys.people.all, 'search', args, paginationArgs] as const,
        bySlug: (slug: string) =>
            [...queryKeys.people.all, 'details', slug] as const,
        anime: (slug: string, paginationArgs?: PaginationArgs) =>
            [...queryKeys.people.all, 'anime', slug, paginationArgs] as const,
        manga: (slug: string, paginationArgs?: PaginationArgs) =>
            [...queryKeys.people.all, 'manga', slug, paginationArgs] as const,
        novel: (slug: string, paginationArgs?: PaginationArgs) =>
            [...queryKeys.people.all, 'novel', slug, paginationArgs] as const,
        characters: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.people.all,
                'characters',
                slug,
                paginationArgs,
            ] as const,
    },

    // Auth module keys
    auth: {
        all: ['auth'] as const,
        tokenInfo: () => [...queryKeys.auth.all, 'token', 'info'] as const,
        thirdPartyTokens: (paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.auth.all,
                'token',
                'thirdParty',
                paginationArgs,
            ] as const,
        oauthUrl: (provider: string) =>
            [...queryKeys.auth.all, 'oauth', 'url', provider] as const,
    },

    // Watch module keys
    watch: {
        all: ['watch'] as const,
        entry: (slug: string) =>
            [...queryKeys.watch.all, 'entry', slug] as const,
        list: (
            username: string,
            args: unknown,
            paginationArgs?: PaginationArgs,
        ) =>
            [
                ...queryKeys.watch.all,
                'list',
                username,
                args,
                paginationArgs,
            ] as const,
        random: (username: string, status: string) =>
            [...queryKeys.watch.all, 'random', username, status] as const,
        followingUsers: (slug: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.watch.all,
                'followingUsers',
                slug,
                paginationArgs,
            ] as const,
        stats: (username: string) =>
            [...queryKeys.watch.all, 'stats', username] as const,
    },

    // Read module keys
    read: {
        all: ['read'] as const,
        entry: (contentType: string, slug: string) =>
            [...queryKeys.read.all, 'entry', contentType, slug] as const,
        list: (
            contentType: string,
            username: string,
            args: unknown,
            paginationArgs?: PaginationArgs,
        ) =>
            [
                ...queryKeys.read.all,
                'list',
                contentType,
                username,
                args,
                paginationArgs,
            ] as const,
        random: (contentType: string, username: string, status: string) =>
            [
                ...queryKeys.read.all,
                'random',
                contentType,
                username,
                status,
            ] as const,
        followingUsers: (
            contentType: string,
            slug: string,
            paginationArgs?: PaginationArgs,
        ) =>
            [
                ...queryKeys.read.all,
                'followingUsers',
                contentType,
                slug,
                paginationArgs,
            ] as const,
        stats: (contentType: string, username: string) =>
            [...queryKeys.read.all, 'stats', contentType, username] as const,
    },

    // Favourite module keys
    favourite: {
        all: ['favourite'] as const,
        status: (contentType: string, slug: string) =>
            [...queryKeys.favourite.all, 'status', contentType, slug] as const,
        list: (
            contentType: string,
            username: string,
            paginationArgs?: PaginationArgs,
        ) =>
            [
                ...queryKeys.favourite.all,
                'list',
                contentType,
                username,
                paginationArgs,
            ] as const,
    },

    // Comments module keys
    comments: {
        all: ['comments'] as const,
        latest: () => [...queryKeys.comments.all, 'latest'] as const,
        list: (paginationArgs?: PaginationArgs) =>
            [...queryKeys.comments.all, 'list', paginationArgs] as const,
        content: (
            contentType: string,
            slug: string,
            paginationArgs?: PaginationArgs,
        ) =>
            [
                ...queryKeys.comments.all,
                'content',
                contentType,
                slug,
                paginationArgs,
            ] as const,
        thread: (commentReference: string) =>
            [...queryKeys.comments.all, 'thread', commentReference] as const,
    },

    // Follow module keys
    follow: {
        all: ['follow'] as const,
        status: (username: string) =>
            [...queryKeys.follow.all, 'status', username] as const,
        stats: (username: string) =>
            [...queryKeys.follow.all, 'stats', username] as const,
        followers: (username: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.follow.all,
                'followers',
                username,
                paginationArgs,
            ] as const,
        followings: (username: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.follow.all,
                'followings',
                username,
                paginationArgs,
            ] as const,
    },

    // Vote module keys
    vote: {
        all: ['vote'] as const,
        status: (contentType: string, slug: string) =>
            [...queryKeys.vote.all, 'status', contentType, slug] as const,
    },

    // History module keys
    history: {
        all: ['history'] as const,
        following: (paginationArgs?: PaginationArgs) =>
            [...queryKeys.history.all, 'following', paginationArgs] as const,
        user: (username: string, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.history.all,
                'user',
                username,
                paginationArgs,
            ] as const,
    },

    // Schedule module keys
    schedule: {
        all: ['schedule'] as const,
        anime: (args: unknown, paginationArgs?: PaginationArgs) =>
            [...queryKeys.schedule.all, 'anime', args, paginationArgs] as const,
    },

    // Stats module keys
    stats: {
        all: ['stats'] as const,
        editsTop: (paginationArgs?: PaginationArgs) =>
            [...queryKeys.stats.all, 'edits', 'top', paginationArgs] as const,
    },

    // Genres module keys
    genres: {
        all: ['genres'] as const,
        list: () => [...queryKeys.genres.all, 'list'] as const,
    },

    // Companies module keys
    companies: {
        all: ['companies'] as const,
        search: (args: unknown, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.companies.all,
                'search',
                args,
                paginationArgs,
            ] as const,
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
        list: (args: unknown, paginationArgs?: PaginationArgs) =>
            [...queryKeys.articles.all, 'list', args, paginationArgs] as const,
        bySlug: (slug: string) =>
            [...queryKeys.articles.all, 'details', slug] as const,
        stats: () => [...queryKeys.articles.all, 'stats'] as const,
    },

    // Artifacts module keys
    artifacts: {
        all: ['artifacts'] as const,
        byUsernameAndName: (username: string, name: string) =>
            [...queryKeys.artifacts.all, 'details', username, name] as const,
        privacy: (name: string) =>
            [...queryKeys.artifacts.all, 'privacy', name] as const,
        userPrivacy: (username: string, name: string) =>
            [...queryKeys.artifacts.all, 'privacy', username, name] as const,
    },

    // Edit module keys
    edit: {
        all: ['edit'] as const,
        byId: (editId: number | string) =>
            [...queryKeys.edit.all, 'id', editId] as const,
        list: (args: unknown, paginationArgs?: PaginationArgs) =>
            [...queryKeys.edit.all, 'list', args, paginationArgs] as const,
        todoList: (args: unknown, paginationArgs?: PaginationArgs) =>
            [
                ...queryKeys.edit.all,
                'todo',
                'list',
                args,
                paginationArgs,
            ] as const,
    },

    // Settings module keys
    settings: {
        all: ['settings'] as const,
        ignoredNotifications: () =>
            [...queryKeys.settings.all, 'ignored-notifications'] as const,
        userProfile: () => [...queryKeys.settings.all, 'profile'] as const,
    },

    // Client module keys
    client: {
        all: ['client'] as const,
        byReference: (reference: string) =>
            [...queryKeys.client.all, 'reference', reference] as const,
        fullInfo: (reference: string) =>
            [...queryKeys.client.all, 'full-info', reference] as const,
        list: (paginationArgs?: PaginationArgs) =>
            [...queryKeys.client.all, 'list', paginationArgs] as const,
    },
};
