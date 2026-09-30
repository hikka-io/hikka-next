import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import * as api from '@hikka/api';

import {
    applyFavouriteDeletion,
    applyFavouriteMutation,
    applyReadDeletion,
    applyVoteMutation,
    applyWatchDeletion,
    invalidateArticles,
    invalidateCollections,
    invalidateComments,
    invalidateContentBySlug,
    invalidateEdits,
    invalidateFollow,
    invalidateNotifications,
    invalidateReadState,
    invalidateSession,
    invalidateUserClients,
    invalidateVote,
    invalidateWatchState,
    patchEmbeddedFollow,
    patchEmbeddedVote,
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
        ]);
        const drifted = [...registered].filter(
            (id) => builders[`${id}QueryKey`]?.()[0]._id !== id,
        );

        expect(registered.size).toBe(56);
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
            'invalidateUserClients',
            (queryClient) => invalidateUserClients(queryClient),
            [expected(['listUserClients'])],
        ],
        [
            'invalidateVote for a comment',
            (queryClient) =>
                invalidateVote(queryClient, {
                    content_type: api.VoteContentTypeEnum.COMMENT,
                    slug: SLUG,
                }),
            [expected(COMMENT_LIST_IDS, 'none')],
        ],
        [
            'invalidateVote for an article',
            (queryClient) =>
                invalidateVote(queryClient, {
                    content_type: api.VoteContentTypeEnum.ARTICLE,
                    slug: SLUG,
                }),
            [expected(['getArticle'])],
        ],
        [
            'invalidateVote for a collection',
            (queryClient) =>
                invalidateVote(queryClient, {
                    content_type: api.VoteContentTypeEnum.COLLECTION,
                    slug: SLUG,
                }),
            [expected(['getCollection'])],
        ],
        [
            'invalidateVote for another article',
            (queryClient) =>
                invalidateVote(queryClient, {
                    content_type: api.VoteContentTypeEnum.ARTICLE,
                    slug: 'other-article',
                }),
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
            'invalidateFollow for the profile owner',
            (queryClient) =>
                invalidateFollow(queryClient, {
                    username: USERNAME,
                    is_followed: true,
                }),
            [
                expected([...FOLLOW_IDS, 'userProfile']),
                expected([...ARTICLE_IDS, ...COLLECTION_IDS], 'none'),
            ],
        ],
        [
            'invalidateFollow for another user',
            (queryClient) =>
                invalidateFollow(queryClient, {
                    username: 'someone-else',
                    is_followed: true,
                }),
            [
                expected(FOLLOW_IDS),
                expected([...ARTICLE_IDS, ...COLLECTION_IDS], 'none'),
            ],
        ],
        [
            'invalidateFollow for a username prefix',
            (queryClient) =>
                invalidateFollow(queryClient, {
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

    it('invalidateFollow patches the author-embedding queries', async () => {
        const { queryClient, patches } = createRecordingClient();

        await invalidateFollow(queryClient, {
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

describe('patchEmbeddedFollow', () => {
    it('flips the target user at any depth and keeps the rest', () => {
        const other = author('other', false);
        const untouchedPage = { list: [{ reference: 'b', author: other }] };
        const data = {
            pages: [
                {
                    list: [
                        { reference: 'a', author: author(USERNAME, false) },
                        { reference: 'c', author: other },
                    ],
                },
                untouchedPage,
            ],
            pageParams: [1, 2],
        };

        const patched = patchEmbeddedFollow(data, {
            username: USERNAME,
            is_followed: true,
        });

        expect(patched.pages[0].list[0].author).toEqual(author(USERNAME, true));
        expect(patched.pages[0].list[1]).toBe(data.pages[0].list[1]);
        expect(patched.pages[1]).toBe(untouchedPage);
        expect(patched.pageParams).toBe(data.pageParams);
        expect(data.pages[0].list[0].author.is_followed).toBe(false);
    });

    it('patches a top-level user and the popular-authors shape', () => {
        expect(
            patchEmbeddedFollow(author(USERNAME, false), {
                username: USERNAME,
                is_followed: true,
            }),
        ).toEqual(author(USERNAME, true));
        expect(
            patchEmbeddedFollow(
                { authors: [{ user: author(USERNAME, true), accepted: 3 }] },
                { username: USERNAME, is_followed: false },
            ),
        ).toEqual({
            authors: [{ user: author(USERNAME, false), accepted: 3 }],
        });
    });

    it.each([
        ['another user', author('other', false)],
        ['an already matching state', author(USERNAME, true)],
        ['a user without is_followed', { username: USERNAME }],
    ])('returns the same object for %s', (_, user) => {
        const data = { list: [{ author: user }] };

        expect(
            patchEmbeddedFollow(data, {
                username: USERNAME,
                is_followed: true,
            }),
        ).toBe(data);
    });
});

describe('patchEmbeddedVote', () => {
    const comment = (
        reference: string,
        my_score: number,
        vote_score: number,
    ) => ({
        reference,
        my_score,
        vote_score,
    });

    it('moves the score by the change of my_score, also in nested replies', () => {
        const sibling = comment('sibling', 0, 2);
        const data = {
            list: [
                {
                    ...comment('parent', 0, 5),
                    replies: [comment('target', 1, 4), sibling],
                },
            ],
        };

        const patched = patchEmbeddedVote(data, 'target', -1);

        expect(patched.list[0].replies[0]).toEqual(comment('target', -1, 2));
        expect(patched.list[0]).toMatchObject(comment('parent', 0, 5));
        expect(patched.list[0].replies[1]).toBe(sibling);
    });

    it('returns the same object when nothing changes', () => {
        const data = {
            list: [comment('target', 1, 4), comment('other', 0, 1)],
        };

        expect(patchEmbeddedVote(data, 'target', 1)).toBe(data);
        expect(patchEmbeddedVote(data, 'missing', 1)).toBe(data);
    });
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

describe('invalidateFollow on a live cache', () => {
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

        await invalidateFollow(queryClient, {
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
