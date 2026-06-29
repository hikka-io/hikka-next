import type { FeedArgs, GetFeedResponse } from './gen';

interface Paginated {
    pagination: { page: number; pages: number };
}

/**
 * Shared `getNextPageParam`/`initialPageParam` for Hikka's page/pages pagination.
 */
export function paginationPageParam<T extends Paginated>() {
    return {
        initialPageParam: 1,
        getNextPageParam: (lastPage: T): number | null => {
            const next = lastPage.pagination.page + 1;
            return next > lastPage.pagination.pages ? null : next;
        },
    };
}

/**
 * Folds a starting page into the cache key of a generated
 * `xxxInfiniteOptions(...)` result and wires Hikka's page/pages pagination.
 *
 * The generated infinite query key is built only from body/query/path, so the
 * page is otherwise absent from it: every page collides on one cache entry and
 * TanStack Query ignores `initialPageParam` once that entry is warm. That makes
 * page-jump pagination (the `?page=N` widget and loader
 * `ensureInfiniteQueryData`) silently return the first page. Folding the page
 * into `queryKey[0].query` gives each page its own entry, restoring jumps —
 * mirroring the pre-migration key that carried `paginationArgs`.
 *
 * The result also carries `getNextPageParam` + `initialPageParam`, so it can be
 * handed straight to `useInfiniteQuery`, the web app's `useInfiniteList`, or
 * `queryClient.ensureInfiniteQueryData`.
 */
export function paginatedInfiniteOptions<
    TOptions extends { queryKey: readonly unknown[] },
>(options: TOptions, page = 1): TOptions {
    const [firstKey, ...restKey] = options.queryKey as [
        Record<string, unknown>,
        ...unknown[],
    ];

    // Returned as `TOptions` so the generated page type (and thus
    // `getNextPageParam`/list/pagination inference) is preserved for consumers;
    // the page/pages `getNextPageParam` + `initialPageParam` are added at
    // runtime to back the generated options' (otherwise unfulfilled) type.
    return {
        ...options,
        ...paginationPageParam(),
        queryKey: [
            {
                ...firstKey,
                query: {
                    ...(firstKey.query as Record<string, unknown> | undefined),
                    page,
                },
            },
            ...restKey,
        ],
        initialPageParam: page,
    } as unknown as TOptions;
}

/**
 * Cursor pagination for `getFeedInfiniteOptions`: the `/feed` endpoint pages on
 * a `before` timestamp instead of page numbers and returns a flat array. The
 * next cursor is the last item's `created` (Unix seconds) as an ISO string;
 * the first page is an empty param (no `before`, leaving the body untouched).
 */
export function feedPageParam() {
    return {
        initialPageParam: { body: {} as FeedArgs },
        getNextPageParam: (lastPage: GetFeedResponse): string | undefined => {
            const last = lastPage.at(-1);
            return last
                ? new Date(last.created * 1000).toISOString()
                : undefined;
        },
    };
}
