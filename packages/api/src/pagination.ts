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
