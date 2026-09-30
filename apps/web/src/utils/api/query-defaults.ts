import type {
    QueryClient,
    QueryClientConfig,
    QueryObserverOptions,
} from '@tanstack/react-query';

type ApiExport = keyof typeof import('@hikka/api');

type QueryId = {
    [K in ApiExport]: K extends `${string}InfiniteQueryKey`
        ? never
        : K extends `${infer Id}QueryKey`
          ? Id
          : never;
}[ApiExport];

type TierOptions = Pick<
    QueryObserverOptions,
    'staleTime' | 'refetchOnWindowFocus'
>;

type QueryDefaultTier = {
    ids: readonly QueryId[];
    options: TierOptions;
};

export const QUERY_CLIENT_DEFAULTS = {
    staleTime: 60 * 1000,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
} as const satisfies NonNullable<
    QueryClientConfig['defaultOptions']
>['queries'];

export const QUERY_DEFAULT_TIERS = [
    {
        ids: ['genres', 'providerUrl', 'searchCompanies'],
        options: { staleTime: Infinity },
    },
    {
        ids: [
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
            'characterAnime',
            'characterManga',
            'characterNovel',
            'characterVoices',
            'personAnime',
            'personManga',
            'personNovel',
            'personVoices',
        ],
        options: { staleTime: 10 * 60 * 1000 },
    },
    {
        ids: ['unseenNotificationsCount'],
        options: { staleTime: 30 * 1000, refetchOnWindowFocus: true },
    },
    {
        ids: ['getFeed'],
        options: { refetchOnWindowFocus: true },
    },
] as const satisfies readonly QueryDefaultTier[];

// Generated keys are `[{ _id, baseUrl, ... }]`; `setQueryDefaults` matches `[{ _id }]` against them partially.
export function applyQueryDefaults(queryClient: QueryClient): void {
    for (const { ids, options } of QUERY_DEFAULT_TIERS) {
        for (const id of ids) {
            queryClient.setQueryDefaults([{ _id: id }], options);
        }
    }
}
