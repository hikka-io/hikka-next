import type { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import * as api from '@hikka/api';

import {
    applyFavouriteMutation,
    invalidateArticles,
    invalidateCollections,
    invalidateComments,
    invalidateContentBySlug,
    invalidateEdits,
    invalidateFollow,
    invalidateIgnoredNotifications,
    invalidateNotifications,
    invalidateReadState,
    invalidateSession,
    invalidateUserClients,
    invalidateVote,
    invalidateWatchState,
    writeReadToCaches,
    writeWatchToCaches,
} from './invalidate-content-state';

type QueryKey = readonly [{ _id: string }];
type KeyBuilder = (options?: { path?: Record<string, string> }) => QueryKey;
type Filters = {
    predicate?: (query: { queryKey: readonly unknown[] }) => boolean;
    refetchType?: string;
};

const SLUG = 'one-piece';
const USERNAME = 'target-user';

const WATCH_EMBED_IDS = [
    'searchAnime',
    'animeRecommendations',
    'characterAnime',
    'personAnime',
    'contentFranchise',
    'favouriteList',
    'getCollection',
    'getCollections',
];
const READ_EMBED_IDS = [
    'searchManga',
    'searchNovel',
    'characterManga',
    'characterNovel',
    'personManga',
    'personNovel',
    'contentFranchise',
    'favouriteList',
    'getCollection',
    'getCollections',
];
const COMMENT_IDS = [
    'commentsList',
    'getCommentsList',
    'getCommentsUser',
    'thread',
    'latestComments',
    'animeSlug',
    'mangaInfo',
    'novelInfo',
];
const EDIT_LIST_IDS = [
    'getEdits',
    'editsTop',
    'getContentEditTodo',
    'getTodoAnimeList',
    'getTodoMangaList',
    'getTodoNovelList',
    'getTodoCharacterList',
    'getTodoPersonList',
];
const COLLECTION_IDS = ['getCollections', 'getCollection'];
const ARTICLE_IDS = ['getArticles', 'getArticleTop', 'getArticle'];
const FOLLOW_IDS = [
    'followingList',
    'followersList',
    'followStats',
    'followingHistory',
    'getFeed',
    'getWatchFollowing',
    'getReadFollowing',
];
const CONTENT_DETAIL_IDS = [
    'animeSlug',
    'mangaInfo',
    'novelInfo',
    'characterInfo',
    'personInfo',
    'contentFranchise',
    'animeCharacters',
    'mangaCharacters',
    'novelCharacters',
    'animeStaff',
    'animeEpisodes',
    'characterVoices',
    'personVoices',
];

const builders = api as unknown as Record<string, KeyBuilder | undefined>;

const SAMPLE_KEYS = Object.entries(builders).flatMap(([name, build]) =>
    build && name.endsWith('QueryKey') && !name.endsWith('InfiniteQueryKey')
        ? [build({ path: { slug: SLUG, username: USERNAME } })]
        : [],
);

function createRecordingClient() {
    const invalidations: Filters[] = [];
    const patches: Filters[] = [];
    const queryClient = {
        invalidateQueries: vi.fn((filters: Filters) => {
            invalidations.push(filters);
            return Promise.resolve();
        }),
        setQueriesData: vi.fn((filters: Filters) => {
            patches.push(filters);
        }),
        setQueryData: vi.fn(),
    } as unknown as QueryClient;
    return { queryClient, invalidations, patches };
}

function summarize({ predicate, refetchType }: Filters) {
    const ids = SAMPLE_KEYS.filter((queryKey) => predicate?.({ queryKey })).map(
        (queryKey) => queryKey[0]._id,
    );
    return { ids: new Set(ids), refetchType };
}

function expected(ids: string[], refetchType?: 'none' | 'all') {
    return { ids: new Set(ids), refetchType };
}

describe('invalidation registry ids', () => {
    it('are all generated query key ids', () => {
        const registered = new Set([
            'userWatchList',
            'userReadList',
            ...WATCH_EMBED_IDS,
            ...READ_EMBED_IDS,
            ...COMMENT_IDS,
            ...EDIT_LIST_IDS,
            ...COLLECTION_IDS,
            ...ARTICLE_IDS,
            ...FOLLOW_IDS,
            ...CONTENT_DETAIL_IDS,
            'profile',
            'notifications',
            'unseenNotificationsCount',
            'getIgnoredNotifications',
            'listUserClients',
            'userProfile',
        ]);
        const drifted = [...registered].filter(
            (id) => builders[`${id}QueryKey`]?.()[0]._id !== id,
        );

        expect(registered.size).toBe(57);
        expect(drifted).toEqual([]);
    });
});

describe('invalidation helpers', () => {
    it.each<
        [
            string,
            (queryClient: QueryClient) => Promise<void>,
            ReturnType<typeof expected>[],
        ]
    >([
        [
            'invalidateWatchState',
            (queryClient) => invalidateWatchState(queryClient),
            [expected(['userWatchList']), expected(WATCH_EMBED_IDS, 'none')],
        ],
        [
            'invalidateWatchState without refetch',
            (queryClient) =>
                invalidateWatchState(queryClient, { refetch: false }),
            [
                expected(['userWatchList'], 'none'),
                expected(WATCH_EMBED_IDS, 'none'),
            ],
        ],
        [
            'invalidateReadState',
            (queryClient) => invalidateReadState(queryClient),
            [expected(['userReadList']), expected(READ_EMBED_IDS, 'none')],
        ],
        [
            'invalidateComments',
            (queryClient) => invalidateComments(queryClient),
            [expected(COMMENT_IDS)],
        ],
        [
            'invalidateEdits',
            (queryClient) => invalidateEdits(queryClient),
            [expected(EDIT_LIST_IDS)],
        ],
        [
            'invalidateCollections',
            (queryClient) => invalidateCollections(queryClient),
            [expected(COLLECTION_IDS)],
        ],
        [
            'invalidateArticles',
            (queryClient) =>
                invalidateArticles(queryClient, { refetch: false }),
            [expected(ARTICLE_IDS, 'none')],
        ],
        [
            'invalidateSession',
            (queryClient) => invalidateSession(queryClient),
            [expected(['profile'])],
        ],
        [
            'invalidateNotifications',
            (queryClient) => invalidateNotifications(queryClient),
            [expected(['notifications', 'unseenNotificationsCount'])],
        ],
        [
            'invalidateIgnoredNotifications',
            (queryClient) => invalidateIgnoredNotifications(queryClient),
            [expected(['getIgnoredNotifications'])],
        ],
        [
            'invalidateUserClients',
            (queryClient) => invalidateUserClients(queryClient),
            [expected(['listUserClients'])],
        ],
        [
            'invalidateVote',
            (queryClient) => invalidateVote(queryClient),
            [expected(['getArticle', 'getCollection', ...COMMENT_IDS])],
        ],
        [
            'applyFavouriteMutation',
            (queryClient) =>
                applyFavouriteMutation(
                    queryClient,
                    api.FavouriteContentTypeEnum.ANIME,
                    SLUG,
                    {} as api.FavouriteResponse,
                ),
            [expected(['favouriteList'])],
        ],
        [
            'invalidateFollow for the profile owner',
            (queryClient) => invalidateFollow(queryClient, USERNAME),
            [
                expected([
                    ...FOLLOW_IDS,
                    ...ARTICLE_IDS,
                    ...COLLECTION_IDS,
                    'userProfile',
                ]),
            ],
        ],
        [
            'invalidateFollow for another user',
            (queryClient) => invalidateFollow(queryClient, 'someone-else'),
            [expected([...FOLLOW_IDS, ...ARTICLE_IDS, ...COLLECTION_IDS])],
        ],
        [
            'invalidateContentBySlug',
            (queryClient) => invalidateContentBySlug(queryClient, SLUG),
            [expected(CONTENT_DETAIL_IDS, 'all')],
        ],
        [
            'invalidateContentBySlug for a slug prefix',
            (queryClient) => invalidateContentBySlug(queryClient, 'one'),
            [expected([], 'all')],
        ],
    ])('%s matches the same queries', async (_, run, calls) => {
        const { queryClient, invalidations } = createRecordingClient();

        await run(queryClient);

        expect(invalidations.map(summarize)).toEqual(calls);
    });

    it('writeWatchToCaches patches the watch-embedding queries', () => {
        const { queryClient, patches } = createRecordingClient();

        writeWatchToCaches(queryClient, {
            anime: { slug: SLUG },
        } as api.WatchResponse);

        expect(patches.map(summarize)).toEqual([expected(WATCH_EMBED_IDS)]);
    });

    it('writeReadToCaches patches the read-embedding queries', () => {
        const { queryClient, patches } = createRecordingClient();

        writeReadToCaches(queryClient, {
            content: { slug: SLUG, data_type: api.ReadContentTypeEnum.MANGA },
        } as api.ReadResponse);

        expect(patches.map(summarize)).toEqual([expected(READ_EMBED_IDS)]);
    });
});
