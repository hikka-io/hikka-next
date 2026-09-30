import { CancelledError, hashKey, QueryClient } from '@tanstack/react-query';
import { isNotFound } from '@tanstack/react-router';
import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {
    animeCharactersInfiniteOptions,
    type Client,
    ContentTypeEnum,
    configureBrowserClient,
    createRequestClient,
    ExternalTypeEnum,
    HikkaApiError,
    mangaCharactersInfiniteOptions,
    novelCharactersInfiniteOptions,
    type ProfileResponse,
    profileQueryKey,
} from '@hikka/api';

import { getAuthTokenFn, getNsfwConsentFn } from '@/utils/cookies';

import { Route as AnimeRoute } from '../../routes/_pages/anime/$slug';
import { Route as AnimeCharactersRoute } from '../../routes/_pages/anime/$slug/characters';
import { Route as AnimeFranchiseRoute } from '../../routes/_pages/anime/$slug/franchise';
import { Route as AnimeOverviewRoute } from '../../routes/_pages/anime/$slug/index';
import { Route as AnimeStaffRoute } from '../../routes/_pages/anime/$slug/staff';
import { Route as CharacterRoute } from '../../routes/_pages/characters/$slug';
import { Route as MangaRoute } from '../../routes/_pages/manga/$slug';
import { Route as MangaCharactersRoute } from '../../routes/_pages/manga/$slug/characters';
import { Route as MangaFranchiseRoute } from '../../routes/_pages/manga/$slug/franchise';
import { Route as MangaOverviewRoute } from '../../routes/_pages/manga/$slug/index';
import { Route as NovelRoute } from '../../routes/_pages/novel/$slug';
import { Route as NovelCharactersRoute } from '../../routes/_pages/novel/$slug/characters';
import { Route as NovelFranchiseRoute } from '../../routes/_pages/novel/$slug/franchise';
import { Route as NovelOverviewRoute } from '../../routes/_pages/novel/$slug/index';
import { Route as PersonRoute } from '../../routes/_pages/people/$slug';
import {
    contentDetailHead,
    contentDetailTitle,
    entityDetailHead,
} from './detail-route';
import {
    animeStaffOptions,
    contentCharactersOptions,
    franchiseOptions,
} from './queries';

const cookies = vi.hoisted(() => ({
    authToken: null as string | null,
    nsfwConsent: null as string | null,
}));

vi.mock('@/utils/cookies', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/cookies')>()),
    getAuthTokenFn: vi.fn(async () => cookies.authToken),
    getNsfwConsentFn: vi.fn(async () => cookies.nsfwConsent),
}));

const BASE_URL = 'https://api.example.test';
const SITE_URL = 'https://site.example.test';
const slug = 'test-slug';

const PROFILE: ProfileResponse = {
    reference: '7d2f6a4e-1c3b-4b8e-9f0a-5e6d7c8b9a01',
    updated: null,
    created: 1700000000,
    description: null,
    username: 'tester',
    cover: null,
    active: true,
    avatar: 'https://cdn.example.test/avatar.jpg',
    role: 'user',
    email: 'tester@example.test',
};

const GENERAL_LINK = {
    url: 'https://general.example.test',
    text: 'General',
    type: ExternalTypeEnum.GENERAL,
};

function mediaInfo(
    restrictedType: ExternalTypeEnum,
    originalTitle: Record<string, string | null>,
) {
    return {
        slug,
        nsfw: false,
        title_ua: null,
        title_en: null,
        ...originalTitle,
        start_date: 930000000,
        updated: 1700000000,
        mal_id: 42,
        synopsis_ua: null,
        synopsis_en: '**Bold** synopsis',
        external: [
            GENERAL_LINK,
            {
                url: `https://${restrictedType}.example.test`,
                text: 'Restricted',
                type: restrictedType,
            },
        ],
    };
}

function entityInfo() {
    return {
        slug,
        name_ua: null,
        name_en: 'Entity Name',
        name_ja: null,
        description_ua: 'Entity description',
        image: 'https://cdn.example.test/entity.jpg',
    };
}

type LoaderRoute = {
    options: {
        loader?: unknown;
        head?: unknown;
    };
};

const CONTENT_ROUTES = {
    anime: {
        route: AnimeRoute,
        info: () =>
            mediaInfo(ExternalTypeEnum.WATCH, { title_ja: 'Original JA' }),
    },
    manga: {
        route: MangaRoute,
        info: () =>
            mediaInfo(ExternalTypeEnum.READ, {
                title_original: 'Original Manga',
            }),
    },
    novel: {
        route: NovelRoute,
        info: () =>
            mediaInfo(ExternalTypeEnum.READ, {
                title_original: 'Original Novel',
            }),
    },
} as const;

const ENTITY_ROUTES = {
    character: { route: CharacterRoute, info: entityInfo },
    person: { route: PersonRoute, info: entityInfo },
} as const;

const INFO_IDS = new Set([
    'animeSlug',
    'mangaInfo',
    'novelInfo',
    'characterInfo',
    'personInfo',
]);

type AuthState = 'anonymous' | 'authenticated';

type Recorder = {
    queryClient: QueryClient;
    calls: string[];
    setQueryDataCalls: [string, unknown][];
};

function recordingQueryClient(
    info: unknown,
    auth: AuthState,
    fail?: { id: string; error: Error; times: number },
): Recorder {
    const queryClient = new QueryClient();
    const calls: string[] = [];
    const setQueryDataCalls: [string, unknown][] = [];
    let failures = 0;

    if (auth === 'authenticated') {
        queryClient.setQueryData(profileQueryKey(), PROFILE);
    }

    const record =
        (method: string) =>
        async (options: {
            queryKey: readonly [{ _id: string }];
            initialPageParam?: unknown;
            getNextPageParam?: unknown;
        }) => {
            const paged =
                options.initialPageParam === 1 &&
                typeof options.getNextPageParam === 'function';
            calls.push(
                `${method}${paged ? '+page' : ''} ${JSON.stringify(options.queryKey)}`,
            );

            const id = options.queryKey[0]._id;
            if (fail && fail.id === id && failures < fail.times) {
                failures += 1;
                throw fail.error;
            }
            if (INFO_IDS.has(id)) return info;
            return method.includes('Infinite')
                ? { pages: [], pageParams: [] }
                : {};
        };

    const prefetch = (method: string) => {
        const run = record(method);
        return async (options: Parameters<typeof run>[0]) => {
            await run(options).catch(() => undefined);
        };
    };

    Object.assign(queryClient, {
        ensureQueryData: record('ensureQueryData'),
        ensureInfiniteQueryData: record('ensureInfiniteQueryData'),
        prefetchQuery: prefetch('prefetchQuery'),
        prefetchInfiniteQuery: prefetch('prefetchInfiniteQuery'),
        fetchQuery: record('fetchQuery'),
        fetchInfiniteQuery: record('fetchInfiniteQuery'),
    });

    const setQueryData = queryClient.setQueryData.bind(queryClient);
    queryClient.setQueryData = ((key: unknown, data: unknown) => {
        setQueryDataCalls.push([JSON.stringify(key), data]);
        return setQueryData(key as never, data as never);
    }) as QueryClient['setQueryData'];

    return { queryClient, calls, setQueryDataCalls };
}

function apiClientFor(auth: AuthState): Client {
    return createRequestClient({
        baseUrl: BASE_URL,
        authToken: auth === 'authenticated' ? 'token' : undefined,
    });
}

function setAuthState(auth: AuthState) {
    cookies.authToken = auth === 'authenticated' ? 'token' : null;
}

async function runLoader(
    route: LoaderRoute,
    info: unknown,
    auth: AuthState,
    fail?: { id: string; error: Error; times: number },
) {
    setAuthState(auth);
    const recorder = recordingQueryClient(info, auth, fail);
    const loader = route.options.loader as (ctx: unknown) => Promise<unknown>;
    const result = await loader({
        params: { slug },
        context: {
            queryClient: recorder.queryClient,
            apiClient: apiClientFor(auth),
        },
    });

    return { ...recorder, result: result as Record<string, unknown> };
}

function runHead(route: LoaderRoute, loaderData: unknown) {
    const head = route.options.head as (ctx: unknown) => unknown;
    return head({ loaderData });
}

type HeadOutput = {
    meta?: Record<string, string>[];
    links?: Record<string, string>[];
};

function headLines(output: unknown) {
    const { meta = [], links = [] } = output as HeadOutput;

    return [
        ...meta.map((tag) =>
            tag.title !== undefined
                ? `title=${tag.title}`
                : `${tag.name ? `name:${tag.name}` : `property:${tag.property}`}=${tag.content}`,
        ),
        ...links.map((link) => `link:${link.rel}=${link.href}`),
    ];
}

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

beforeEach(() => {
    vi.stubEnv('VITE_SITE_URL', SITE_URL);
    cookies.authToken = null;
    cookies.nsfwConsent = null;
    vi.mocked(getNsfwConsentFn).mockClear();
    vi.mocked(getAuthTokenFn).mockClear();
});

afterEach(() => {
    vi.unstubAllEnvs();
});

const EXPECTED_KEYS: Record<
    keyof typeof CONTENT_ROUTES | keyof typeof ENTITY_ROUTES,
    Record<AuthState, string[]>
> = {
    anime: {
        anonymous: [
            'ensureQueryData [{"_id":"animeSlug","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
        authenticated: [
            'prefetchQuery [{"_id":"watchGet","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
            'prefetchQuery [{"_id":"getFavourite","baseUrl":"https://api.example.test","path":{"content_type":"anime","slug":"test-slug"}}]',
            'ensureQueryData [{"_id":"animeSlug","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
    },
    manga: {
        anonymous: [
            'ensureQueryData [{"_id":"mangaInfo","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
        authenticated: [
            'prefetchQuery [{"_id":"readGet","baseUrl":"https://api.example.test","path":{"slug":"test-slug","content_type":"manga"}}]',
            'prefetchQuery [{"_id":"getFavourite","baseUrl":"https://api.example.test","path":{"content_type":"manga","slug":"test-slug"}}]',
            'ensureQueryData [{"_id":"mangaInfo","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
    },
    novel: {
        anonymous: [
            'ensureQueryData [{"_id":"novelInfo","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
        authenticated: [
            'prefetchQuery [{"_id":"readGet","baseUrl":"https://api.example.test","path":{"slug":"test-slug","content_type":"novel"}}]',
            'prefetchQuery [{"_id":"getFavourite","baseUrl":"https://api.example.test","path":{"content_type":"novel","slug":"test-slug"}}]',
            'ensureQueryData [{"_id":"novelInfo","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
    },
    character: {
        anonymous: [
            'ensureQueryData [{"_id":"characterInfo","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
        authenticated: [
            'prefetchQuery [{"_id":"getFavourite","baseUrl":"https://api.example.test","path":{"content_type":"character","slug":"test-slug"}}]',
            'ensureQueryData [{"_id":"characterInfo","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
    },
    person: {
        anonymous: [
            'ensureQueryData [{"_id":"personInfo","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
        authenticated: [
            'prefetchQuery [{"_id":"getFavourite","baseUrl":"https://api.example.test","path":{"content_type":"person","slug":"test-slug"}}]',
            'ensureQueryData [{"_id":"personInfo","baseUrl":"https://api.example.test","path":{"slug":"test-slug"}}]',
        ],
    },
};

describe.each(Object.keys(CONTENT_ROUTES) as (keyof typeof CONTENT_ROUTES)[])(
    '%s detail loader',
    (type) => {
        const { route, info } = CONTENT_ROUTES[type];

        it.each(['anonymous', 'authenticated'] as const)(
            'ensures the HEAD query keys in order (%s)',
            async (auth) => {
                const { calls } = await runLoader(route, info(), auth);

                expect(calls).toEqual(EXPECTED_KEYS[type][auth]);
            },
        );

        it('strips restricted externals for anonymous visitors under the info key', async () => {
            const { calls, setQueryDataCalls, result } = await runLoader(
                route,
                info(),
                'anonymous',
            );
            const stripped = { ...info(), external: [GENERAL_LINK] };

            expect(setQueryDataCalls).toEqual([
                [calls[0].slice(calls[0].indexOf(' ') + 1), stripped],
            ]);
            expect(Object.keys(result)).toEqual([type, 'nsfwConsented']);
            expect(result).toEqual({ [type]: stripped, nsfwConsented: false });
        });

        it('keeps restricted externals for authenticated visitors', async () => {
            const { setQueryDataCalls, result } = await runLoader(
                route,
                info(),
                'authenticated',
            );

            expect(setQueryDataCalls).toEqual([]);
            expect(Object.keys(result)).toEqual([type, 'nsfwConsented']);
            expect(result).toEqual({ [type]: info(), nsfwConsented: false });
        });

        it('reads nsfw consent from the document cookie only for nsfw titles', async () => {
            const cookie = vi.spyOn(document, 'cookie', 'get');

            await runLoader(route, info(), 'anonymous');
            expect(cookie).not.toHaveBeenCalled();

            const nsfw = { ...info(), nsfw: true };
            cookie.mockReturnValue('');
            const withoutConsent = await runLoader(route, nsfw, 'anonymous');
            expect(withoutConsent.result.nsfwConsented).toBe(false);

            cookie.mockReturnValue('theme=dark; nsfw_confirmed=1');
            const withConsent = await runLoader(route, nsfw, 'authenticated');
            expect(withConsent.result.nsfwConsented).toBe(true);
            expect(getNsfwConsentFn).not.toHaveBeenCalled();
            cookie.mockRestore();
        });

        it('retries the info fetch once after a cancel and leaves user values unwrapped', async () => {
            const infoKey = EXPECTED_KEYS[type].anonymous[0];
            const infoId = JSON.parse(
                infoKey.slice(infoKey.indexOf(' ') + 1),
            )[0]._id;
            const cancelled = await runLoader(route, info(), 'anonymous', {
                id: infoId,
                error: new CancelledError(),
                times: 1,
            });

            expect(cancelled.calls).toEqual([infoKey, infoKey]);

            const entryKey = EXPECTED_KEYS[type].authenticated[0];
            const failedEntry = await runLoader(
                route,
                info(),
                'authenticated',
                {
                    id: JSON.parse(entryKey.slice(entryKey.indexOf(' ') + 1))[0]
                        ._id,
                    error: new CancelledError(),
                    times: 1,
                },
            );

            expect(failedEntry.calls).toEqual(
                EXPECTED_KEYS[type].authenticated,
            );
            expect(failedEntry.result[type]).toEqual(info());
        });

        it('starts the user values before the info fetch settles and waits for them', async () => {
            let releaseInfo!: () => void;
            let releaseEntry!: () => void;
            const infoGate = new Promise<void>((done) => {
                releaseInfo = done;
            });
            const entryGate = new Promise<void>((done) => {
                releaseEntry = done;
            });
            const recorder = recordingQueryClient(info(), 'authenticated');
            const ensure = recorder.queryClient.ensureQueryData;
            recorder.queryClient.ensureQueryData = (async (options: never) => {
                const pending = ensure(options);
                await infoGate;
                return pending;
            }) as QueryClient['ensureQueryData'];
            const prefetch = recorder.queryClient.prefetchQuery;
            recorder.queryClient.prefetchQuery = (async (options: never) => {
                const pending = prefetch(options);
                await entryGate;
                return pending;
            }) as QueryClient['prefetchQuery'];
            setAuthState('authenticated');
            let settled = false;
            const loading = (
                route.options.loader as (ctx: unknown) => Promise<unknown>
            )({
                params: { slug },
                context: {
                    queryClient: recorder.queryClient,
                    apiClient: apiClientFor('authenticated'),
                },
            }).then(() => {
                settled = true;
            });

            await Promise.resolve();
            expect(recorder.calls).toEqual(EXPECTED_KEYS[type].authenticated);

            releaseInfo();
            await new Promise((done) => setTimeout(done, 0));
            expect(settled).toBe(false);

            releaseEntry();
            await loading;
            expect(settled).toBe(true);
        });

        it('maps a 404 and an empty info response to notFound', async () => {
            const infoId = {
                anime: 'animeSlug',
                manga: 'mangaInfo',
                novel: 'novelInfo',
            }[type];
            const missing = runLoader(route, info(), 'anonymous', {
                id: infoId,
                error: new HikkaApiError('Not found', 404, 'system:not_found'),
                times: 1,
            });

            await expect(missing).rejects.toSatisfy(isNotFound);
            await expect(runLoader(route, null, 'anonymous')).rejects.toSatisfy(
                isNotFound,
            );
        });
    },
);

const charactersKey = (type: string) =>
    `prefetchInfiniteQuery+page [{"_id":"${type}Characters","baseUrl":"https://api.example.test","_infinite":true,"path":{"slug":"test-slug"}}]`;
const franchiseKey = (type: string) =>
    `prefetchQuery [{"_id":"contentFranchise","baseUrl":"https://api.example.test","path":{"slug":"test-slug","content_type":"${type}"}}]`;
const STAFF_KEY =
    'prefetchInfiniteQuery+page [{"_id":"animeStaff","baseUrl":"https://api.example.test","_infinite":true,"path":{"slug":"test-slug"}}]';

const CHILD_ROUTES = [
    ['anime overview', AnimeOverviewRoute, [charactersKey('anime')]],
    ['manga overview', MangaOverviewRoute, [charactersKey('manga')]],
    ['novel overview', NovelOverviewRoute, [charactersKey('novel')]],
    ['anime characters tab', AnimeCharactersRoute, [charactersKey('anime')]],
    ['manga characters tab', MangaCharactersRoute, [charactersKey('manga')]],
    ['novel characters tab', NovelCharactersRoute, [charactersKey('novel')]],
    ['anime staff tab', AnimeStaffRoute, [STAFF_KEY]],
    ['anime franchise tab', AnimeFranchiseRoute, [franchiseKey('anime')]],
    ['manga franchise tab', MangaFranchiseRoute, [franchiseKey('manga')]],
    ['novel franchise tab', NovelFranchiseRoute, [franchiseKey('novel')]],
] as const;

describe.each(CHILD_ROUTES)('%s loader', (_, route, expected) => {
    it.each(['anonymous', 'authenticated'] as const)(
        'prefetches only its own list (%s)',
        async (auth) => {
            const { calls, result } = await runLoader(route, info(), auth);

            expect(calls).toEqual(expected);
            expect(result).toBeUndefined();
        },
    );

    it('resolves when its prefetch fails', async () => {
        const id = JSON.parse(
            expected[0].slice(expected[0].indexOf(' ') + 1),
        )[0]._id;
        const failed = await runLoader(route, info(), 'anonymous', {
            id,
            error: new HikkaApiError('Not found', 404, 'system:not_found'),
            times: 1,
        });

        expect(failed.calls).toEqual(expected);
    });

    function info() {
        return CONTENT_ROUTES.anime.info();
    }
});

describe('content tab loader keys', () => {
    const loaderKey = (line: string) =>
        hashKey(JSON.parse(line.slice(line.indexOf(' ') + 1)));

    it.each([
        ContentTypeEnum.ANIME,
        ContentTypeEnum.MANGA,
        ContentTypeEnum.NOVEL,
    ] as const)('match the %s characters list', (type) => {
        const head = {
            [ContentTypeEnum.ANIME]: animeCharactersInfiniteOptions,
            [ContentTypeEnum.MANGA]: mangaCharactersInfiniteOptions,
            [ContentTypeEnum.NOVEL]: novelCharactersInfiniteOptions,
        }[type]({ path: { slug } }).queryKey;

        expect(hashKey(contentCharactersOptions(type, slug).queryKey)).toBe(
            loaderKey(charactersKey(type)),
        );
        expect(hashKey(head)).toBe(loaderKey(charactersKey(type)));
    });

    it('match the anime staff list', () => {
        expect(hashKey(animeStaffOptions(slug).queryKey)).toBe(
            loaderKey(STAFF_KEY),
        );
    });

    it.each([
        ContentTypeEnum.ANIME,
        ContentTypeEnum.MANGA,
        ContentTypeEnum.NOVEL,
    ] as const)('match the %s franchise query', (content_type) => {
        expect(hashKey(franchiseOptions(content_type, slug).queryKey)).toBe(
            loaderKey(franchiseKey(content_type)),
        );
    });
});

describe.each(Object.keys(ENTITY_ROUTES) as (keyof typeof ENTITY_ROUTES)[])(
    '%s detail loader',
    (type) => {
        const { route, info } = ENTITY_ROUTES[type];

        it.each(['anonymous', 'authenticated'] as const)(
            'ensures the HEAD query keys in order (%s)',
            async (auth) => {
                const { calls, setQueryDataCalls, result } = await runLoader(
                    route,
                    info(),
                    auth,
                );

                expect(calls).toEqual(EXPECTED_KEYS[type][auth]);
                expect(setQueryDataCalls).toEqual([]);
                expect(Object.keys(result)).toEqual([type]);
                expect(result).toEqual({ [type]: info() });
            },
        );

        it('starts the favourite before the info fetch settles', async () => {
            let releaseInfo!: () => void;
            const infoGate = new Promise<void>((done) => {
                releaseInfo = done;
            });
            const recorder = recordingQueryClient(info(), 'authenticated');
            const record = recorder.queryClient.ensureQueryData;
            recorder.queryClient.ensureQueryData = (async (options: {
                queryKey: readonly [{ _id: string }];
            }) => {
                const pending = record(options as never);
                if (INFO_IDS.has(options.queryKey[0]._id)) await infoGate;
                return pending;
            }) as QueryClient['ensureQueryData'];
            setAuthState('authenticated');
            const loading = (
                route.options.loader as (ctx: unknown) => Promise<unknown>
            )({
                params: { slug },
                context: {
                    queryClient: recorder.queryClient,
                    apiClient: apiClientFor('authenticated'),
                },
            });

            await Promise.resolve();
            expect(recorder.calls).toEqual(EXPECTED_KEYS[type].authenticated);

            releaseInfo();
            await expect(loading).resolves.toEqual({ [type]: info() });
        });

        it('maps a 404 info response to notFound', async () => {
            const infoKey = EXPECTED_KEYS[type].anonymous[0];
            const missing = runLoader(route, info(), 'authenticated', {
                id: JSON.parse(infoKey.slice(infoKey.indexOf(' ') + 1))[0]._id,
                error: new HikkaApiError('Not found', 404, 'system:not_found'),
                times: 1,
            });

            await expect(missing).rejects.toSatisfy(isNotFound);
        });
    },
);

const HEAD_CASES = {
    fallback: (type: string, info: object) => ({
        [type]: info,
        nsfwConsented: false,
    }),
    nsfw: (type: string, info: object) => ({
        [type]: {
            ...info,
            nsfw: true,
            title_en: 'English Title',
            start_date: null,
            mal_id: 0,
            synopsis_ua: 'x'.repeat(200),
        },
        nsfwConsented: true,
    }),
    named: (type: string, info: object) => ({ [type]: info }),
    defaults: (type: string, info: object) => ({
        [type]: { ...info, name_en: null, description_ua: null, image: null },
    }),
};

const TRUNCATED_SYNOPSIS = `${'x'.repeat(148)}\u2026`;
const DEFAULT_DESCRIPTION =
    'Hikka - українська онлайн енциклопедія аніме, манґи та ранобе. Весь список, манґи та ранобе, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого та прочитаного, кастомізуй профіль та ділись з друзями.';

const EXPECTED_HEAD: Record<string, Record<string, string[]>> = {
    anime: {
        fallback: [
            'title=Original JA (1999) / Hikka',
            'name:description=Bold synopsis\r\n',
            'property:og:title=Original JA (1999) / Hikka',
            'property:og:description=Bold synopsis\r\n',
            'property:og:site_name=Hikka',
            'property:og:image=https://site.example.test/api/og/anime?slug=test-slug&v=1700000000',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title=Original JA (1999) / Hikka',
            'name:twitter:description=Bold synopsis\r\n',
            'name:twitter:image=https://site.example.test/api/og/anime?slug=test-slug&v=1700000000',
            'property:og:image:width=1200',
            'property:og:image:height=630',
            'property:og:image:type=image/jpeg',
            'property:og:url=https://hikka.io/anime/test-slug',
            'name:mal-id=42',
            'link:canonical=https://hikka.io/anime/test-slug',
        ],
        nsfw: [
            'title=English Title / Hikka',
            `name:description=${TRUNCATED_SYNOPSIS}`,
            'property:og:title=English Title / Hikka',
            `property:og:description=${TRUNCATED_SYNOPSIS}`,
            'property:og:site_name=Hikka',
            'property:og:image=https://site.example.test/api/og/anime?slug=test-slug&v=1700000000',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title=English Title / Hikka',
            `name:twitter:description=${TRUNCATED_SYNOPSIS}`,
            'name:twitter:image=https://site.example.test/api/og/anime?slug=test-slug&v=1700000000',
            'property:og:image:width=1200',
            'property:og:image:height=630',
            'property:og:image:type=image/jpeg',
            'property:og:url=https://hikka.io/anime/test-slug',
            'name:robots=noindex',
            'link:canonical=https://hikka.io/anime/test-slug',
        ],
    },
    manga: {
        fallback: [
            'title=Original Manga (1999) / Hikka',
            'name:description=Bold synopsis\r\n',
            'property:og:title=Original Manga (1999) / Hikka',
            'property:og:description=Bold synopsis\r\n',
            'property:og:site_name=Hikka',
            'property:og:image=https://site.example.test/api/og/manga?slug=test-slug&v=1700000000',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title=Original Manga (1999) / Hikka',
            'name:twitter:description=Bold synopsis\r\n',
            'name:twitter:image=https://site.example.test/api/og/manga?slug=test-slug&v=1700000000',
            'property:og:image:width=1200',
            'property:og:image:height=630',
            'property:og:image:type=image/jpeg',
            'property:og:url=https://hikka.io/manga/test-slug',
            'name:mal-id=42',
            'link:canonical=https://hikka.io/manga/test-slug',
        ],
        nsfw: [
            'title=English Title / Hikka',
            `name:description=${TRUNCATED_SYNOPSIS}`,
            'property:og:title=English Title / Hikka',
            `property:og:description=${TRUNCATED_SYNOPSIS}`,
            'property:og:site_name=Hikka',
            'property:og:image=https://site.example.test/api/og/manga?slug=test-slug&v=1700000000',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title=English Title / Hikka',
            `name:twitter:description=${TRUNCATED_SYNOPSIS}`,
            'name:twitter:image=https://site.example.test/api/og/manga?slug=test-slug&v=1700000000',
            'property:og:image:width=1200',
            'property:og:image:height=630',
            'property:og:image:type=image/jpeg',
            'property:og:url=https://hikka.io/manga/test-slug',
            'name:robots=noindex',
            'link:canonical=https://hikka.io/manga/test-slug',
        ],
    },
    novel: {
        fallback: [
            'title=Original Novel (1999) / Hikka',
            'name:description=Bold synopsis\r\n',
            'property:og:title=Original Novel (1999) / Hikka',
            'property:og:description=Bold synopsis\r\n',
            'property:og:site_name=Hikka',
            'property:og:image=https://site.example.test/api/og/novel?slug=test-slug&v=1700000000',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title=Original Novel (1999) / Hikka',
            'name:twitter:description=Bold synopsis\r\n',
            'name:twitter:image=https://site.example.test/api/og/novel?slug=test-slug&v=1700000000',
            'property:og:image:width=1200',
            'property:og:image:height=630',
            'property:og:image:type=image/jpeg',
            'property:og:url=https://hikka.io/novel/test-slug',
            'name:mal-id=42',
            'link:canonical=https://hikka.io/novel/test-slug',
        ],
        nsfw: [
            'title=English Title / Hikka',
            `name:description=${TRUNCATED_SYNOPSIS}`,
            'property:og:title=English Title / Hikka',
            `property:og:description=${TRUNCATED_SYNOPSIS}`,
            'property:og:site_name=Hikka',
            'property:og:image=https://site.example.test/api/og/novel?slug=test-slug&v=1700000000',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title=English Title / Hikka',
            `name:twitter:description=${TRUNCATED_SYNOPSIS}`,
            'name:twitter:image=https://site.example.test/api/og/novel?slug=test-slug&v=1700000000',
            'property:og:image:width=1200',
            'property:og:image:height=630',
            'property:og:image:type=image/jpeg',
            'property:og:url=https://hikka.io/novel/test-slug',
            'name:robots=noindex',
            'link:canonical=https://hikka.io/novel/test-slug',
        ],
    },
    character: {
        named: [
            'title=Entity Name / Hikka',
            'name:description=Entity description',
            'property:og:title=Entity Name / Hikka',
            'property:og:description=Entity description',
            'property:og:site_name=Hikka',
            'property:og:image=https://cdn.example.test/entity.jpg',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title=Entity Name / Hikka',
            'name:twitter:description=Entity description',
            'name:twitter:image=https://cdn.example.test/entity.jpg',
            'property:og:url=https://hikka.io/characters/test-slug',
            'link:canonical=https://hikka.io/characters/test-slug',
        ],
        defaults: [
            'title= / Hikka',
            `name:description=${DEFAULT_DESCRIPTION}`,
            'property:og:title= / Hikka',
            `property:og:description=${DEFAULT_DESCRIPTION}`,
            'property:og:site_name=Hikka',
            'property:og:image=https://hikka.io/preview.jpg',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title= / Hikka',
            `name:twitter:description=${DEFAULT_DESCRIPTION}`,
            'name:twitter:image=https://hikka.io/preview.jpg',
            'property:og:url=https://hikka.io/characters/test-slug',
            'link:canonical=https://hikka.io/characters/test-slug',
        ],
    },
    person: {
        named: [
            'title=Entity Name / Hikka',
            'name:description=Entity description',
            'property:og:title=Entity Name / Hikka',
            'property:og:description=Entity description',
            'property:og:site_name=Hikka',
            'property:og:image=https://cdn.example.test/entity.jpg',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title=Entity Name / Hikka',
            'name:twitter:description=Entity description',
            'name:twitter:image=https://cdn.example.test/entity.jpg',
            'property:og:url=https://hikka.io/people/test-slug',
            'link:canonical=https://hikka.io/people/test-slug',
        ],
        defaults: [
            'title= / Hikka',
            `name:description=${DEFAULT_DESCRIPTION}`,
            'property:og:title= / Hikka',
            `property:og:description=${DEFAULT_DESCRIPTION}`,
            'property:og:site_name=Hikka',
            'property:og:image=https://hikka.io/preview.jpg',
            'property:og:type=website',
            'property:og:locale=uk_UA',
            'name:twitter:card=summary_large_image',
            'name:twitter:title= / Hikka',
            `name:twitter:description=${DEFAULT_DESCRIPTION}`,
            'name:twitter:image=https://hikka.io/preview.jpg',
            'property:og:url=https://hikka.io/people/test-slug',
            'link:canonical=https://hikka.io/people/test-slug',
        ],
    },
};

describe.each(Object.keys(CONTENT_ROUTES) as (keyof typeof CONTENT_ROUTES)[])(
    '%s detail head',
    (type) => {
        const { route, info } = CONTENT_ROUTES[type];

        it('returns no tags without loader data', () => {
            expect(runHead(route, undefined)).toEqual({});
        });

        it.each(['fallback', 'nsfw'] as const)(
            'matches the HEAD tags (%s)',
            (variant) => {
                const lines = headLines(
                    runHead(route, HEAD_CASES[variant](type, info())),
                );
                expect(lines).toEqual(EXPECTED_HEAD[type][variant]);
            },
        );
    },
);

describe.each(Object.keys(ENTITY_ROUTES) as (keyof typeof ENTITY_ROUTES)[])(
    '%s detail head',
    (type) => {
        const { route, info } = ENTITY_ROUTES[type];

        it('returns no tags without loader data', () => {
            expect(runHead(route, undefined)).toEqual({});
        });

        it.each(['named', 'defaults'] as const)(
            'matches the HEAD tags (%s)',
            (variant) => {
                const lines = headLines(
                    runHead(route, HEAD_CASES[variant](type, info())),
                );
                expect(lines).toEqual(EXPECTED_HEAD[type][variant]);
            },
        );
    },
);

describe('detail loader session', () => {
    it.each(Object.entries({ ...CONTENT_ROUTES, ...ENTITY_ROUTES }))(
        '%s reads the session from the cache, not the cookie',
        async (_, { route, info }) => {
            await runLoader(route, info(), 'anonymous');
            await runLoader(route, info(), 'authenticated');

            expect(getAuthTokenFn).not.toHaveBeenCalled();
        },
    );

    it.each(Object.keys(CONTENT_ROUTES) as (keyof typeof CONTENT_ROUTES)[])(
        '%s treats a cookie without a cached profile as anonymous',
        async (type) => {
            const { route, info } = CONTENT_ROUTES[type];
            cookies.authToken = 'token';
            const recorder = recordingQueryClient(info(), 'anonymous');
            const loader = route.options.loader as (
                ctx: unknown,
            ) => Promise<unknown>;

            await loader({
                params: { slug },
                context: {
                    queryClient: recorder.queryClient,
                    apiClient: apiClientFor('authenticated'),
                },
            });

            expect(recorder.calls).toEqual(EXPECTED_KEYS[type].anonymous);
            expect(recorder.setQueryDataCalls).toHaveLength(1);
        },
    );
});

describe('contentDetailHead and entityDetailHead', () => {
    it.each(Object.keys(CONTENT_ROUTES) as (keyof typeof CONTENT_ROUTES)[])(
        '%s matches the HEAD tags',
        (type) => {
            const { info } = CONTENT_ROUTES[type];

            expect(contentDetailHead(type, undefined)).toEqual({});
            for (const variant of ['fallback', 'nsfw'] as const) {
                expect(
                    headLines(
                        contentDetailHead(
                            type,
                            HEAD_CASES[variant](type, info()) as never,
                        ),
                    ),
                ).toEqual(EXPECTED_HEAD[type][variant]);
            }
        },
    );

    it.each(Object.keys(ENTITY_ROUTES) as (keyof typeof ENTITY_ROUTES)[])(
        '%s matches the HEAD tags',
        (type) => {
            const { info } = ENTITY_ROUTES[type];

            expect(entityDetailHead(type, undefined)).toEqual({});
            for (const variant of ['named', 'defaults'] as const) {
                expect(
                    headLines(
                        entityDetailHead(
                            type,
                            HEAD_CASES[variant](type, info()) as never,
                        ),
                    ),
                ).toEqual(EXPECTED_HEAD[type][variant]);
            }
        },
    );
});

describe('contentDetailHead year', () => {
    it.each([
        ['just before UTC new year', 946683000, '(1999)'],
        ['just after UTC new year', 946686600, '(2000)'],
    ])('reads the UTC year %s', (_, startDate, year) => {
        const { info } = CONTENT_ROUTES.anime;
        const head = contentDetailHead('anime', {
            anime: { ...info(), start_date: startDate },
            nsfwConsented: false,
        } as never);

        expect(headLines(head)[0]).toBe(`title=Original JA ${year} / Hikka`);
    });
});

describe('contentDetailTitle', () => {
    const titles = {
        title_ua: null,
        title_en: null,
        title_ja: 'Japanese',
        title_original: 'Original',
    };

    it.each([
        ['anime', 'Japanese'],
        ['manga', 'Original'],
        ['novel', 'Original'],
    ] as const)('%s falls back to %s', (type, expected) => {
        expect(contentDetailTitle(type, titles as never)).toBe(expected);
    });

    it('prefers the Ukrainian, then the English title', () => {
        expect(
            contentDetailTitle('anime', {
                ...titles,
                title_ua: 'Українська',
                title_en: 'English',
            } as never),
        ).toBe('Українська');
        expect(
            contentDetailTitle('manga', {
                ...titles,
                title_en: 'English',
            } as never),
        ).toBe('English');
    });

    it('returns an empty string without any title', () => {
        expect(
            contentDetailTitle('novel', {
                title_ua: null,
                title_en: null,
                title_original: null,
            } as never),
        ).toBe('');
    });
});
