import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import * as api from '@hikka/api';

import {
    applyFavouriteDeletion,
    applyFavouriteMutation,
    applyFollowChange,
    applyReadDeletion,
    applyVoteMutation,
    applyWatchDeletion,
    invalidateArticles,
    invalidateAuthTokens,
    invalidateCollections,
    invalidateComments,
    invalidateContentBySlug,
    invalidateEdits,
    invalidateNotifications,
    invalidateReadState,
    invalidateSession,
    invalidateSessionDependentQueries,
    invalidateUserClients,
    invalidateUserProfile,
    invalidateWatchState,
    resetPageList,
    writeIgnoredNotifications,
    writeReadToCaches,
    writeSessionUI,
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
const COMMENT_LIST_IDS = [
    'commentsList',
    'getCommentsList',
    'getCommentsUser',
    'thread',
    'latestComments',
];
const COMMENT_IDS = [
    ...COMMENT_LIST_IDS,
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
const FOLLOW_EMBED_IDS = [
    ...ARTICLE_IDS,
    ...COLLECTION_IDS,
    'followingList',
    'followersList',
    'favouriteList',
    'userProfile',
];
const AVATAR_EMBED_IDS = [
    ...COMMENT_LIST_IDS,
    ...ARTICLE_IDS,
    ...COLLECTION_IDS,
    'followingList',
    'followersList',
];
const SESSION_DEPENDENT_IDS = [
    'animeSlug',
    'mangaInfo',
    'novelInfo',
    'watchGet',
    'readGet',
    'getFavourite',
    'getVote',
    ...WATCH_EMBED_IDS,
    ...READ_EMBED_IDS,
    ...COMMENT_LIST_IDS,
    ...FOLLOW_EMBED_IDS,
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
        ? [
              build({
                  path: { slug: SLUG, reference: SLUG, username: USERNAME },
              }),
          ]
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
        cancelQueries: vi.fn(() => Promise.resolve()),
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
            'listUserClients',
            'userProfile',
            ...SESSION_DEPENDENT_IDS,
        ]);
        const drifted = [...registered].filter(
            (id) => builders[`${id}QueryKey`]?.()[0]._id !== id,
        );

        expect(registered.size).toBe(60);
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
            'invalidateSessionDependentQueries',
            (queryClient) => invalidateSessionDependentQueries(queryClient),
            [expected(SESSION_DEPENDENT_IDS)],
        ],
        [
            'invalidateAuthTokens',
            (queryClient) => invalidateAuthTokens(queryClient),
            [expected(['thirdPartyAuthTokens'])],
        ],
        [
            'invalidateNotifications',
            (queryClient) => invalidateNotifications(queryClient),
            [expected(['notifications', 'unseenNotificationsCount'])],
        ],
        [
            'invalidateUserClients',
            (queryClient) => invalidateUserClients(queryClient),
            [expected(['listUserClients'])],
        ],
        [
            'invalidateUserProfile for the profile owner',
            (queryClient) => invalidateUserProfile(queryClient, USERNAME),
            [expected(['userProfile']), expected(AVATAR_EMBED_IDS, 'none')],
        ],
        [
            'invalidateUserProfile for a username prefix',
            (queryClient) => invalidateUserProfile(queryClient, 'target'),
            [expected([]), expected(AVATAR_EMBED_IDS, 'none')],
        ],
        [
            'applyVoteMutation for a comment',
            (queryClient) =>
                applyVoteMutation(
                    queryClient,
                    {
                        content_type: api.VoteContentTypeEnum.COMMENT,
                        slug: SLUG,
                    },
                    { score: 1 },
                ),
            [expected(COMMENT_LIST_IDS, 'none')],
        ],
        [
            'applyVoteMutation for an article',
            (queryClient) =>
                applyVoteMutation(
                    queryClient,
                    {
                        content_type: api.VoteContentTypeEnum.ARTICLE,
                        slug: SLUG,
                    },
                    { score: 1 },
                ),
            [expected(['getArticle'])],
        ],
        [
            'applyVoteMutation for a collection',
            (queryClient) =>
                applyVoteMutation(
                    queryClient,
                    {
                        content_type: api.VoteContentTypeEnum.COLLECTION,
                        slug: SLUG,
                    },
                    { score: 1 },
                ),
            [expected(['getCollection'])],
        ],
        [
            'applyVoteMutation for another article',
            (queryClient) =>
                applyVoteMutation(
                    queryClient,
                    {
                        content_type: api.VoteContentTypeEnum.ARTICLE,
                        slug: 'other-article',
                    },
                    { score: 1 },
                ),
            [expected([])],
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
            'applyFollowChange for the profile owner',
            (queryClient) =>
                applyFollowChange(queryClient, {
                    username: USERNAME,
                    is_followed: true,
                }),
            [
                expected([...FOLLOW_IDS, 'userProfile']),
                expected([...ARTICLE_IDS, ...COLLECTION_IDS], 'none'),
            ],
        ],
        [
            'applyFollowChange for another user',
            (queryClient) =>
                applyFollowChange(queryClient, {
                    username: 'someone-else',
                    is_followed: true,
                }),
            [
                expected(FOLLOW_IDS),
                expected([...ARTICLE_IDS, ...COLLECTION_IDS], 'none'),
            ],
        ],
        [
            'applyFollowChange for a username prefix',
            (queryClient) =>
                applyFollowChange(queryClient, {
                    username: 'target',
                    is_followed: false,
                }),
            [
                expected(FOLLOW_IDS),
                expected([...ARTICLE_IDS, ...COLLECTION_IDS], 'none'),
            ],
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

    it('applyFollowChange patches the author-embedding queries', async () => {
        const { queryClient, patches } = createRecordingClient();

        await applyFollowChange(queryClient, {
            username: USERNAME,
            is_followed: true,
        });

        expect(patches.map(summarize)).toEqual([expected(FOLLOW_EMBED_IDS)]);
    });

    it.each([
        [api.VoteContentTypeEnum.COMMENT, [expected(COMMENT_LIST_IDS)]],
        [api.VoteContentTypeEnum.ARTICLE, []],
        [api.VoteContentTypeEnum.COLLECTION, []],
    ])(
        'applyVoteMutation for a %s stores the vote and patches its lists',
        async (content_type, calls) => {
            const { queryClient, patches } = createRecordingClient();

            await applyVoteMutation(
                queryClient,
                { content_type, slug: SLUG },
                { score: 1 },
            );

            expect(queryClient.setQueryData).toHaveBeenCalledWith(
                api.getVoteQueryKey({ path: { content_type, slug: SLUG } }),
                { score: 1 },
            );
            expect(patches.map(summarize)).toEqual(calls);
        },
    );
});

describe.each([
    {
        name: 'applyWatchDeletion',
        key: api.watchGetQueryKey({ path: { slug: SLUG } }),
        remove: (queryClient: QueryClient) =>
            applyWatchDeletion(queryClient, SLUG),
        lists: [expected(['userWatchList']), expected(WATCH_EMBED_IDS, 'none')],
        patched: WATCH_EMBED_IDS,
    },
    {
        name: 'applyReadDeletion',
        key: api.readGetQueryKey({
            path: { content_type: api.ReadContentTypeEnum.MANGA, slug: SLUG },
        }),
        remove: (queryClient: QueryClient) =>
            applyReadDeletion(queryClient, api.ReadContentTypeEnum.MANGA, SLUG),
        lists: [expected(['userReadList']), expected(READ_EMBED_IDS, 'none')],
        patched: READ_EMBED_IDS,
    },
    {
        name: 'applyFavouriteDeletion',
        key: api.getFavouriteQueryKey({
            path: {
                content_type: api.FavouriteContentTypeEnum.ANIME,
                slug: SLUG,
            },
        }),
        remove: (queryClient: QueryClient) =>
            applyFavouriteDeletion(
                queryClient,
                api.FavouriteContentTypeEnum.ANIME,
                SLUG,
            ),
        lists: [expected(['favouriteList'])],
        patched: [],
    },
])('$name', ({ key, remove, lists, patched }) => {
    it('keeps null when a fetch of the entry is in flight during the deletion', async () => {
        const queryClient = new QueryClient();
        let resolveFetch: (value: unknown) => void = () => undefined;
        const observer = new QueryObserver(queryClient, {
            queryKey: key,
            queryFn: () =>
                new Promise((resolve) => {
                    resolveFetch = resolve;
                }),
        });
        const unsubscribe = observer.subscribe(() => undefined);
        await vi.waitFor(() =>
            expect(queryClient.getQueryState(key)?.fetchStatus).toBe(
                'fetching',
            ),
        );

        await remove(queryClient);
        resolveFetch({ reference: 'stale' });
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(queryClient.getQueryData(key)).toBeNull();
        unsubscribe();
    });

    it('stores the per-content entry as null instead of refetching it', async () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn().mockResolvedValue({ reference: 'entry' });
        const observer = new QueryObserver(queryClient, {
            queryKey: key,
            queryFn,
            staleTime: Infinity,
        });
        const unsubscribe = observer.subscribe(() => undefined);
        await vi.waitFor(() =>
            expect(queryClient.getQueryData(key)).toEqual({
                reference: 'entry',
            }),
        );

        await remove(queryClient);

        expect(queryClient.getQueryData(key)).toBeNull();
        expect(queryClient.getQueryState(key)?.isInvalidated).toBe(false);
        expect(observer.getCurrentResult().data).toBeNull();
        expect(queryFn).toHaveBeenCalledTimes(1);
        unsubscribe();
    });

    it('still invalidates the lists and patches the embeds', async () => {
        const { queryClient, invalidations, patches } = createRecordingClient();

        await remove(queryClient);

        expect(queryClient.setQueryData).toHaveBeenCalledWith(key, null);
        expect(invalidations.map(summarize)).toEqual(lists);
        expect(patches.map(summarize)).toEqual(
            patched.length ? [expected(patched)] : [],
        );
    });
});

const author = (username: string, is_followed: boolean) => ({
    username,
    is_followed,
    avatar: `${username}.png`,
});

function observe(
    queryClient: QueryClient,
    queryKey: readonly unknown[],
    data: unknown,
) {
    const queryFn = vi.fn().mockResolvedValue(data);
    const observer = new QueryObserver(queryClient, {
        queryKey,
        queryFn,
        staleTime: Infinity,
    });
    const unsubscribe = observer.subscribe(() => undefined);
    return { queryFn, unsubscribe };
}

describe('applyFollowChange on a live cache', () => {
    it('patches the lists in place, stale-marks them and refetches only the follow data', async () => {
        const queryClient = new QueryClient();
        const collectionsKey = api.getCollectionsQueryKey({ body: {} });
        const collections = {
            list: [
                { reference: 'a', author: author(USERNAME, false) },
                { reference: 'b', author: author('other', false) },
            ],
        };
        const statsKey = api.followStatsQueryKey({
            path: { username: USERNAME },
        });
        const otherProfileKey = api.userProfileQueryKey({
            path: { username: 'other' },
        });
        const targetProfileKey = api.userProfileQueryKey({
            path: { username: USERNAME },
        });
        const list = observe(queryClient, collectionsKey, collections);
        const stats = observe(queryClient, statsKey, { followers: 1 });
        await vi.waitFor(() =>
            expect(queryClient.getQueryData(statsKey)).toBeDefined(),
        );
        queryClient.setQueryData(otherProfileKey, author('other', false));
        queryClient.setQueryData(targetProfileKey, author(USERNAME, false));
        const otherProfileState = queryClient.getQueryState(otherProfileKey);

        await applyFollowChange(queryClient, {
            username: USERNAME,
            is_followed: true,
        });

        const patched =
            queryClient.getQueryData<typeof collections>(collectionsKey);
        expect(patched?.list[0].author.is_followed).toBe(true);
        expect(patched?.list[1]).toBe(collections.list[1]);
        expect(queryClient.getQueryState(collectionsKey)?.isInvalidated).toBe(
            true,
        );
        expect(list.queryFn).toHaveBeenCalledTimes(1);
        expect(stats.queryFn).toHaveBeenCalledTimes(2);
        expect(queryClient.getQueryData(targetProfileKey)).toEqual(
            author(USERNAME, true),
        );
        expect(queryClient.getQueryState(otherProfileKey)).toBe(
            otherProfileState,
        );
        list.unsubscribe();
        stats.unsubscribe();
    });
});

describe('writeWatchToCaches on a live cache', () => {
    it('patches the embedding query and leaves the others stale', async () => {
        const queryClient = new QueryClient();
        const matchKey = api.searchAnimeQueryKey({ body: {} });
        const otherKey = api.getCollectionsQueryKey({ body: {} });
        queryClient.setQueryData(matchKey, {
            list: [{ slug: SLUG, watch: [] }],
        });
        queryClient.setQueryData(otherKey, {
            list: [{ content: { slug: 'other', watch: [] } }],
        });
        await queryClient.invalidateQueries({ refetchType: 'none' });
        const otherState = queryClient.getQueryState(otherKey);

        writeWatchToCaches(queryClient, {
            anime: { slug: SLUG },
            status: 'watching',
        } as api.WatchResponse);

        expect(queryClient.getQueryData(matchKey)).toEqual({
            list: [{ slug: SLUG, watch: [{ status: 'watching' }] }],
        });
        expect(queryClient.getQueryState(otherKey)).toBe(otherState);
        expect(queryClient.getQueryState(otherKey)?.isInvalidated).toBe(true);
    });
});

describe('applyVoteMutation on a live cache', () => {
    const commentsKey = api.commentsListQueryKey();
    const infoKey = api.animeSlugQueryKey({ path: { slug: SLUG } });

    it('patches a voted comment without refetching comments or content info', async () => {
        const queryClient = new QueryClient();
        const comments = {
            list: [{ reference: 'c1', my_score: 0, vote_score: 3 }],
        };
        const list = observe(queryClient, commentsKey, comments);
        const info = observe(queryClient, infoKey, { comments_count: 1 });
        await vi.waitFor(() =>
            expect(queryClient.getQueryData(infoKey)).toBeDefined(),
        );

        await applyVoteMutation(
            queryClient,
            { content_type: api.VoteContentTypeEnum.COMMENT, slug: 'c1' },
            { score: 1 },
        );

        expect(queryClient.getQueryData(commentsKey)).toEqual({
            list: [{ reference: 'c1', my_score: 1, vote_score: 4 }],
        });
        expect(queryClient.getQueryState(commentsKey)?.isInvalidated).toBe(
            true,
        );
        expect(queryClient.getQueryState(infoKey)?.isInvalidated).toBe(false);
        expect(list.queryFn).toHaveBeenCalledTimes(1);
        expect(info.queryFn).toHaveBeenCalledTimes(1);
        list.unsubscribe();
        info.unsubscribe();
    });

    it('refetches only the voted article', async () => {
        const queryClient = new QueryClient();
        const votedKey = api.getArticleQueryKey({ path: { slug: SLUG } });
        const otherKey = api.getArticleQueryKey({ path: { slug: 'other' } });
        const voted = observe(queryClient, votedKey, { vote_score: 1 });
        const other = observe(queryClient, otherKey, { vote_score: 1 });
        const list = observe(queryClient, commentsKey, { list: [] });
        await vi.waitFor(() =>
            expect(queryClient.getQueryData(commentsKey)).toBeDefined(),
        );

        await applyVoteMutation(
            queryClient,
            { content_type: api.VoteContentTypeEnum.ARTICLE, slug: SLUG },
            { score: 1 },
        );

        expect(voted.queryFn).toHaveBeenCalledTimes(2);
        expect(other.queryFn).toHaveBeenCalledTimes(1);
        expect(list.queryFn).toHaveBeenCalledTimes(1);
        voted.unsubscribe();
        other.unsubscribe();
        list.unsubscribe();
    });
});

describe('writeIgnoredNotifications', () => {
    it('replaces the cached ignored types without refetching', () => {
        const queryClient = new QueryClient();
        const key = api.getIgnoredNotificationsQueryKey();
        queryClient.setQueryData(key, { ignored_notifications: [] });

        writeIgnoredNotifications(queryClient, {
            ignored_notifications: ['comment_reply'],
        } as api.IgnoredNotificationsResponse);

        expect(queryClient.getQueryData(key)).toEqual({
            ignored_notifications: ['comment_reply'],
        });
        expect(queryClient.getQueryState(key)?.isInvalidated).toBe(false);
    });
});

describe('writeSessionUI', () => {
    it('patches the cached UI and restores a snapshot', () => {
        const queryClient = new QueryClient();
        const key = api.profileUiQueryKey();
        const snapshot = {
            styles: null,
            preferences: { title_language: 'title_ua' },
        } as unknown as api.UserCustomizationResponse;
        queryClient.setQueryData(key, snapshot);

        writeSessionUI(queryClient, (old) => ({
            ...(old as api.UserCustomizationResponse),
            styles: { dark: null } as api.UserCustomizationResponse['styles'],
        }));
        expect(queryClient.getQueryData(key)).toEqual({
            ...snapshot,
            styles: { dark: null },
        });

        writeSessionUI(queryClient, snapshot);
        expect(queryClient.getQueryData(key)).toEqual(snapshot);
    });
});

describe('resetPageList', () => {
    it('removes only the queries under the given key', () => {
        const queryClient = new QueryClient();
        queryClient.setQueryData(['list', 1], 'page one');
        queryClient.setQueryData(['list', 2], 'page two');
        queryClient.setQueryData(['other'], 'kept');

        resetPageList(queryClient, ['list']);

        expect(queryClient.getQueryData(['list', 1])).toBeUndefined();
        expect(queryClient.getQueryData(['list', 2])).toBeUndefined();
        expect(queryClient.getQueryData(['other'])).toBe('kept');
    });
});
