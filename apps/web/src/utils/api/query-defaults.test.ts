import {
    focusManager,
    hashKey,
    QueryClient,
    QueryObserver,
} from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as api from '@hikka/api';
import {
    animeSlugOptions,
    CompanyTypeEnum,
    characterAnimeInfiniteOptions,
    genresOptions,
    getArticleOptions,
    getCollectionOptions,
    getCollectionsInfiniteOptions,
    getFeedInfiniteOptions,
    notificationsInfiniteOptions,
    profileOptions,
    providerUrlOptions,
    searchCompaniesInfiniteOptions,
    unseenNotificationsCountOptions,
} from '@hikka/api';

import {
    applyQueryDefaults,
    QUERY_CLIENT_DEFAULTS,
    QUERY_DEFAULT_TIERS,
} from './query-defaults';

const MINUTE = 60 * 1000;
const BASE_URL = 'https://api.example.test';

function createClient() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: QUERY_CLIENT_DEFAULTS },
    });
    applyQueryDefaults(queryClient);
    return queryClient;
}

function keyOf(options: { queryKey: readonly unknown[] }) {
    return options.queryKey;
}

const client = api.createRequestClient({ baseUrl: BASE_URL });

afterEach(() => {
    focusManager.setFocused(undefined);
});

describe('query defaults', () => {
    it('keeps the global defaults and turns focus refetch off', () => {
        const queryClient = createClient();
        const defaults = queryClient.defaultQueryOptions({
            queryKey: keyOf(profileOptions({ client })),
        });

        expect(defaults.staleTime).toBe(MINUTE);
        expect(defaults.gcTime).toBe(Infinity);
        expect(defaults.retry).toBe(false);
        expect(defaults.refetchOnWindowFocus).toBe(false);
        expect(defaults.refetchOnMount).toBeUndefined();
    });

    it.each([
        ['genres', keyOf(genresOptions({ client })), Infinity],
        [
            'providerUrl',
            keyOf(providerUrlOptions({ path: { provider: 'google' }, client })),
            Infinity,
        ],
        [
            'searchCompanies (infinite)',
            keyOf(
                searchCompaniesInfiniteOptions({
                    body: { type: CompanyTypeEnum.STUDIO },
                    client,
                }),
            ),
            Infinity,
        ],
        [
            'animeSlug',
            keyOf(animeSlugOptions({ path: { slug: 'frieren' }, client })),
            10 * MINUTE,
        ],
        [
            'characterAnime (infinite)',
            keyOf(
                characterAnimeInfiniteOptions({
                    path: { slug: 'lelouch' },
                    client,
                }),
            ),
            10 * MINUTE,
        ],
        [
            'getCollection',
            keyOf(getCollectionOptions({ path: { reference: 'ref' }, client })),
            10 * MINUTE,
        ],
        [
            'getArticle',
            keyOf(getArticleOptions({ path: { slug: 'news' }, client })),
            10 * MINUTE,
        ],
        [
            'unseenNotificationsCount',
            keyOf(unseenNotificationsCountOptions({ client })),
            0.5 * MINUTE,
        ],
        [
            'getFeed (infinite)',
            keyOf(getFeedInfiniteOptions({ body: {}, client })),
            MINUTE,
        ],
    ])('applies the %s tier to a generated key', (_, queryKey, staleTime) => {
        const queryClient = createClient();

        expect(queryClient.defaultQueryOptions({ queryKey }).staleTime).toBe(
            staleTime,
        );
    });

    it('opts only the unseen count and the feed into focus refetch', () => {
        const queryClient = createClient();
        const focusOn = (queryKey: readonly unknown[]) =>
            queryClient.defaultQueryOptions({ queryKey }).refetchOnWindowFocus;

        expect(focusOn(keyOf(unseenNotificationsCountOptions()))).toBe(true);
        expect(focusOn(keyOf(getFeedInfiniteOptions({ body: {} })))).toBe(true);
        expect(focusOn(keyOf(animeSlugOptions({ path: { slug: 'x' } })))).toBe(
            false,
        );
        expect(focusOn(keyOf(notificationsInfiniteOptions()))).toBe(false);
    });

    it('leaves unlisted keys on the global defaults', () => {
        const queryClient = createClient();

        for (const queryKey of [
            keyOf(notificationsInfiniteOptions({ client })),
            keyOf(getCollectionsInfiniteOptions({ body: {}, client })),
            keyOf(profileOptions({ client })),
        ]) {
            expect(queryClient.getQueryDefaults(queryKey)).toEqual({});
        }
    });

    it('does not change the query key or its hash', () => {
        const queryClient = createClient();
        const queryKey = keyOf(
            animeSlugOptions({ path: { slug: 'frieren' }, client }),
        );
        const defaults = queryClient.defaultQueryOptions({ queryKey });

        expect(defaults.queryKey).toBe(queryKey);
        expect(defaults.queryHash).toBe(hashKey(queryKey));
    });

    it('lists every generated id once', () => {
        const ids = QUERY_DEFAULT_TIERS.flatMap((tier) => [...tier.ids]);

        expect(new Set(ids).size).toBe(ids.length);
        for (const id of ids) {
            expect(api).toHaveProperty(`${id}QueryKey`);
        }
    });

    it('refetches on focus only for opted-in queries', async () => {
        const queryClient = createClient();
        queryClient.mount();
        const countFn = vi.fn(async () => ({ notifications: 1 }));
        const profileFn = vi.fn(async () => ({ username: 'user' }));
        const updatedAt = Date.now() - 2 * MINUTE;
        const count = unseenNotificationsCountOptions({ client });
        const profile = profileOptions({ client });

        queryClient.setQueryData(
            count.queryKey,
            { notifications: 0 } as never,
            {
                updatedAt,
            },
        );
        queryClient.setQueryData(profile.queryKey, {} as never, { updatedAt });

        const unsubscribers = [
            new QueryObserver(queryClient, {
                queryKey: count.queryKey,
                queryFn: countFn,
                refetchOnMount: false,
            }).subscribe(() => {}),
            new QueryObserver(queryClient, {
                queryKey: profile.queryKey,
                queryFn: profileFn,
                refetchOnMount: false,
            }).subscribe(() => {}),
        ];

        focusManager.setFocused(false);
        focusManager.setFocused(true);
        await vi.waitFor(() => expect(countFn).toHaveBeenCalledTimes(1));

        expect(profileFn).not.toHaveBeenCalled();
        for (const unsubscribe of unsubscribers) unsubscribe();
        queryClient.unmount();
    });
});
