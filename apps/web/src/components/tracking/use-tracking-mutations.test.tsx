import { act } from 'react';
import { createRoot } from 'react-dom/client';

import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    deleteReadMutation,
    deleteWatchMutation,
    ReadStatusEnum,
    readAddMutation,
    WatchStatusEnum,
    watchAddMutation,
} from '@hikka/api';

import {
    applyReadDeletion,
    applyReadMutation,
    applyWatchDeletion,
    applyWatchMutation,
} from '@/utils/api/invalidate-content-state';

import {
    useAddRead,
    useAddWatch,
    useDeleteRead,
    useDeleteWatch,
} from './use-tracking-mutations';

vi.mock('@/utils/api/invalidate-content-state', () => ({
    applyReadDeletion: vi.fn(),
    applyReadMutation: vi.fn(),
    applyWatchDeletion: vi.fn(),
    applyWatchMutation: vi.fn(),
}));

const BASE_URL = 'https://api.test';

type Deferred<T> = { promise: Promise<T>; resolve: (value: T) => void };

const deferred = <T,>(): Deferred<T> => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((done) => {
        resolve = done;
    });
    return { promise, resolve };
};

const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

let events: unknown[][] = [];
let queryClient: QueryClient;
let invalidation: Deferred<void>;
let response: Deferred<Response>;

const record =
    (name: string) =>
    (...args: unknown[]) => {
        events.push([
            name,
            ...args.map((arg) => (arg === queryClient ? 'queryClient' : arg)),
        ]);
        return invalidation.promise;
    };

const ENTRY = {
    reference: 'reference',
    note: null,
    updated: 1,
    created: 1,
    score: 8,
    start_date: 1700000000,
    end_date: null,
};
const CONTENT = {
    start_date: null,
    end_date: null,
    created: null,
    updated: null,
    media_type: null,
    title_ua: 'Назва',
    title_en: null,
    translated_ua: false,
    native_score: 0,
    native_scored_by: 0,
    score: 0,
    scored_by: 0,
    status: null,
    image: null,
    year: null,
    mal_id: 1,
    genres: [],
    synopsis_en: null,
    synopsis_ua: null,
};
const WATCH_DATA = {
    ...ENTRY,
    status: 'completed',
    rewatches: 1,
    duration: 24,
    episodes: 12,
    anime: {
        ...CONTENT,
        data_type: 'anime',
        slug: 'anime-slug',
        title_ja: null,
        episodes_released: 12,
        episodes_total: 12,
        season: null,
        source: null,
        rating: null,
        studios: [],
    },
};
const READ_DATA = {
    ...ENTRY,
    status: 'completed',
    chapters: 20,
    volumes: 3,
    rereads: 0,
    content: {
        ...CONTENT,
        data_type: 'manga',
        slug: 'manga-slug',
        title_original: null,
        chapters: 20,
        volumes: 3,
        magazines: [],
    },
};
const DELETED = { success: true };

const WATCH_BODY = {
    status: WatchStatusEnum.COMPLETED,
    score: 8,
    episodes: 12,
    rewatches: 1,
    note: null,
    start_date: 1700000000,
    end_date: null,
};
const READ_BODY = {
    status: ReadStatusEnum.COMPLETED,
    score: 7,
    volumes: 3,
    chapters: 20,
    rereads: 0,
    note: 'note',
    start_date: null,
    end_date: 1700000000,
};

const WATCH_VARIABLES = { path: { slug: 'anime-slug' }, body: WATCH_BODY };
const READ_VARIABLES = {
    path: { content_type: ContentTypeEnum.MANGA, slug: 'manga-slug' },
    body: READ_BODY,
};
const DELETE_WATCH_VARIABLES = { path: { slug: 'anime-slug' } };
const DELETE_READ_VARIABLES = {
    path: { content_type: ContentTypeEnum.MANGA, slug: 'manga-slug' },
};

type Mutation = { isPending: boolean; mutate: unknown };

type Scenario = {
    useHook: () => Mutation;
    variables: object;
    data: object;
    fail?: boolean;
    unmountBeforeSettle?: boolean;
};

const flush = () =>
    act(async () => {
        for (let i = 0; i < 5; i++) {
            await new Promise((done) => setTimeout(done, 0));
        }
    });

const run = async ({
    useHook,
    variables,
    data,
    fail,
    unmountBeforeSettle,
}: Scenario) => {
    events = [];
    queryClient = new QueryClient();
    invalidation = deferred();
    response = deferred();

    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal('fetch', async (request: Request) => {
        events.push([
            'fetch',
            request.method,
            request.url,
            await request.text(),
        ]);
        return response.promise;
    });

    const probe = {
        current: undefined as Mutation | undefined,
        pending: [] as boolean[],
    };

    const Harness = () => {
        const result = useHook();
        probe.current = result;
        if (probe.pending.at(-1) !== result.isPending) {
            probe.pending.push(result.isPending);
        }
        return null;
    };

    const root = createRoot(document.createElement('div'));
    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <Harness />
            </QueryClientProvider>,
        ),
    );

    const mutate = probe.current?.mutate as (
        variables: object,
        options: object,
    ) => void;
    await act(async () =>
        mutate(variables, {
            onSuccess: () => events.push(['per-call onSuccess']),
            onError: () => events.push(['per-call onError']),
        }),
    );
    await flush();
    const pendingWhileFetching = probe.current?.isPending;

    if (unmountBeforeSettle) await act(async () => root.unmount());

    response.resolve(
        fail ? json({ message: 'Bad', code: 'bad_request' }, 400) : json(data),
    );
    await flush();
    const pendingAfterResponse = probe.current?.isPending;

    events.push(['invalidation settles']);
    invalidation.resolve();
    await flush();

    if (!unmountBeforeSettle) await act(async () => root.unmount());
    vi.unstubAllGlobals();

    return {
        events,
        pending: probe.pending,
        pendingWhileFetching,
        pendingAfterResponse,
        mutationKeys: queryClient
            .getMutationCache()
            .getAll()
            .map((mutation) => mutation.options.mutationKey),
    };
};

const extraAdd = (data: unknown) => events.push(['caller onSuccess', data]);
const extraDelete = () => events.push(['caller onSuccess']);

const useLegacyAddWatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => {
            applyWatchMutation(queryClient, data);
        },
    });
};

const useLegacyAddRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        ...readAddMutation(),
        onSuccess: (data) => {
            applyReadMutation(queryClient, data);
        },
    });
};

const useLegacyGroupAddWatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => applyWatchMutation(queryClient, data),
    });
};

const useLegacyGroupAddRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        ...readAddMutation(),
        onSuccess: (data) => applyReadMutation(queryClient, data),
    });
};

const useLegacyFormAddWatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => {
            applyWatchMutation(queryClient, data);
            extraAdd(data);
        },
    });
};

const useLegacyFormAddRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        ...readAddMutation(),
        onSuccess: (data) => {
            applyReadMutation(queryClient, data);
            extraAdd(data);
        },
    });
};

const useLegacyFormDeleteWatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        ...deleteWatchMutation(),
        onSuccess: (_data, { path }) => {
            applyWatchDeletion(queryClient, path.slug);
            extraDelete();
        },
    });
};

const useLegacyFormDeleteRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        ...deleteReadMutation(),
        onSuccess: (_data, { path }) => {
            applyReadDeletion(queryClient, path.content_type, path.slug);
            extraDelete();
        },
    });
};

const WATCH_FETCH = [
    'fetch',
    'PUT',
    `${BASE_URL}/watch/anime-slug`,
    JSON.stringify(WATCH_BODY),
];
const READ_FETCH = [
    'fetch',
    'PUT',
    `${BASE_URL}/read/manga/manga-slug`,
    JSON.stringify(READ_BODY),
];
const DELETE_WATCH_FETCH = [
    'fetch',
    'DELETE',
    `${BASE_URL}/watch/anime-slug`,
    '',
];
const DELETE_READ_FETCH = [
    'fetch',
    'DELETE',
    `${BASE_URL}/read/manga/manga-slug`,
    '',
];

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
    vi.mocked(applyWatchMutation).mockImplementation(
        record('applyWatchMutation'),
    );
    vi.mocked(applyReadMutation).mockImplementation(
        record('applyReadMutation'),
    );
    vi.mocked(applyWatchDeletion).mockImplementation(
        record('applyWatchDeletion'),
    );
    vi.mocked(applyReadDeletion).mockImplementation(
        record('applyReadDeletion'),
    );
});

describe('tracking mutations at HEAD (legacy inline onSuccess)', () => {
    it('button add: applies, runs the per-call callback, settles before invalidation', async () => {
        for (const [useHook, variables, data, fetched, apply] of [
            [
                useLegacyAddWatch,
                WATCH_VARIABLES,
                WATCH_DATA,
                WATCH_FETCH,
                'applyWatchMutation',
            ],
            [
                useLegacyAddRead,
                READ_VARIABLES,
                READ_DATA,
                READ_FETCH,
                'applyReadMutation',
            ],
        ] as const) {
            const result = await run({ useHook, variables, data });

            expect(result.events).toEqual([
                fetched,
                [apply, 'queryClient', data],
                ['per-call onSuccess'],
                ['invalidation settles'],
            ]);
            expect(result.pending).toEqual([false, true, false]);
            expect(result.pendingWhileFetching).toBe(true);
            expect(result.pendingAfterResponse).toBe(false);
        }
    });

    it('group add: stays pending until the invalidation settles', async () => {
        for (const [useHook, variables, data, fetched, apply] of [
            [
                useLegacyGroupAddWatch,
                WATCH_VARIABLES,
                WATCH_DATA,
                WATCH_FETCH,
                'applyWatchMutation',
            ],
            [
                useLegacyGroupAddRead,
                READ_VARIABLES,
                READ_DATA,
                READ_FETCH,
                'applyReadMutation',
            ],
        ] as const) {
            const result = await run({ useHook, variables, data });

            expect(result.events).toEqual([
                fetched,
                [apply, 'queryClient', data],
                ['invalidation settles'],
                ['per-call onSuccess'],
            ]);
            expect(result.pending).toEqual([false, true, false]);
            expect(result.pendingAfterResponse).toBe(true);
        }
    });

    it('edit form add and delete: apply first, then the extra side effects', async () => {
        for (const [useHook, variables, data, fetched, applied] of [
            [
                useLegacyFormAddWatch,
                WATCH_VARIABLES,
                WATCH_DATA,
                WATCH_FETCH,
                ['applyWatchMutation', 'queryClient', WATCH_DATA],
            ],
            [
                useLegacyFormAddRead,
                READ_VARIABLES,
                READ_DATA,
                READ_FETCH,
                ['applyReadMutation', 'queryClient', READ_DATA],
            ],
        ] as const) {
            const result = await run({ useHook, variables, data });

            expect(result.events).toEqual([
                fetched,
                applied,
                ['caller onSuccess', data],
                ['per-call onSuccess'],
                ['invalidation settles'],
            ]);
        }

        for (const [useHook, variables, fetched, applied] of [
            [
                useLegacyFormDeleteWatch,
                DELETE_WATCH_VARIABLES,
                DELETE_WATCH_FETCH,
                ['applyWatchDeletion', 'queryClient', 'anime-slug'],
            ],
            [
                useLegacyFormDeleteRead,
                DELETE_READ_VARIABLES,
                DELETE_READ_FETCH,
                ['applyReadDeletion', 'queryClient', 'manga', 'manga-slug'],
            ],
        ] as const) {
            const result = await run({ useHook, variables, data: DELETED });

            expect(result.events).toEqual([
                fetched,
                applied,
                ['caller onSuccess'],
                ['per-call onSuccess'],
                ['invalidation settles'],
            ]);
        }
    });

    it('a failed request applies no cache and runs no success callback', async () => {
        const result = await run({
            useHook: useLegacyFormAddWatch,
            variables: WATCH_VARIABLES,
            data: WATCH_DATA,
            fail: true,
        });

        expect(result.events).toEqual([
            WATCH_FETCH,
            ['per-call onError'],
            ['invalidation settles'],
        ]);
        expect(result.pending).toEqual([false, true, false]);
    });

    it('unmounting before the response still applies caches but drops per-call callbacks', async () => {
        const result = await run({
            useHook: useLegacyFormDeleteRead,
            variables: DELETE_READ_VARIABLES,
            data: DELETED,
            unmountBeforeSettle: true,
        });

        expect(result.events).toEqual([
            DELETE_READ_FETCH,
            ['applyReadDeletion', 'queryClient', 'manga', 'manga-slug'],
            ['caller onSuccess'],
            ['invalidation settles'],
        ]);
    });
});

const PAIRS = [
    {
        site: 'watch buttons, triggers and list entry editor',
        legacy: useLegacyAddWatch,
        next: () => useAddWatch(),
        variables: WATCH_VARIABLES,
        data: WATCH_DATA,
    },
    {
        site: 'read buttons, triggers and list entry editor',
        legacy: useLegacyAddRead,
        next: () => useAddRead(),
        variables: READ_VARIABLES,
        data: READ_DATA,
    },
    {
        site: 'watch tracking buttons group',
        legacy: useLegacyGroupAddWatch,
        next: () => useAddWatch({ awaitInvalidation: true }),
        variables: WATCH_VARIABLES,
        data: WATCH_DATA,
    },
    {
        site: 'read tracking buttons group',
        legacy: useLegacyGroupAddRead,
        next: () => useAddRead({ awaitInvalidation: true }),
        variables: READ_VARIABLES,
        data: READ_DATA,
    },
    {
        site: 'watch edit form save',
        legacy: useLegacyFormAddWatch,
        next: () =>
            useAddWatch({
                onSuccess: (data) => {
                    extraAdd(data);
                },
            }),
        variables: WATCH_VARIABLES,
        data: WATCH_DATA,
    },
    {
        site: 'read edit form save',
        legacy: useLegacyFormAddRead,
        next: () =>
            useAddRead({
                onSuccess: (data) => {
                    extraAdd(data);
                },
            }),
        variables: READ_VARIABLES,
        data: READ_DATA,
    },
    {
        site: 'watch edit form delete',
        legacy: useLegacyFormDeleteWatch,
        next: () =>
            useDeleteWatch({
                onSuccess: () => {
                    extraDelete();
                },
            }),
        variables: DELETE_WATCH_VARIABLES,
        data: DELETED,
    },
    {
        site: 'read edit form delete',
        legacy: useLegacyFormDeleteRead,
        next: () =>
            useDeleteRead({
                onSuccess: () => {
                    extraDelete();
                },
            }),
        variables: DELETE_READ_VARIABLES,
        data: DELETED,
    },
];

const OUTCOMES = [
    { outcome: 'success' },
    { outcome: 'failure', fail: true },
    { outcome: 'unmount before settle', unmountBeforeSettle: true },
];

describe('use-tracking-mutations', () => {
    it.each(
        PAIRS.flatMap((pair) =>
            OUTCOMES.map((outcome) => ({ ...pair, ...outcome })),
        ),
    )('matches the $site site on $outcome', async ({
        legacy,
        next,
        ...scenario
    }) => {
        const before = await run({ ...scenario, useHook: legacy });
        const after = await run({ ...scenario, useHook: next });

        expect(after).toEqual(before);
    });

    it('passes data and variables to the caller after applying caches', async () => {
        const result = await run({
            useHook: () =>
                useAddRead({
                    onSuccess: (data, variables) =>
                        events.push(['caller onSuccess', data, variables]),
                }),
            variables: READ_VARIABLES,
            data: READ_DATA,
        });

        expect(result.events).toEqual([
            READ_FETCH,
            ['applyReadMutation', 'queryClient', READ_DATA],
            ['caller onSuccess', READ_DATA, READ_VARIABLES],
            ['per-call onSuccess'],
            ['invalidation settles'],
        ]);
        expect(result.mutationKeys).toEqual([undefined]);
    });

    it('keeps the hook-level callback but drops per-call ones after unmount', async () => {
        const result = await run({
            useHook: () =>
                useAddWatch({
                    onSuccess: (data) => {
                        extraAdd(data);
                    },
                }),
            variables: WATCH_VARIABLES,
            data: WATCH_DATA,
            unmountBeforeSettle: true,
        });

        expect(result.events).toEqual([
            WATCH_FETCH,
            ['applyWatchMutation', 'queryClient', WATCH_DATA],
            ['caller onSuccess', WATCH_DATA],
            ['invalidation settles'],
        ]);
    });
});
