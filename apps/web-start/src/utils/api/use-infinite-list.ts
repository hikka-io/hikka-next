import { useEffect } from 'react';

import {
    type InfiniteData,
    type UseInfiniteQueryOptions,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { paginationPageParam } from '@hikka/api';
import { useInView } from 'react-intersection-observer';

interface PaginatedPage {
    list: unknown[];
    pagination: { page: number; pages: number };
}

/**
 * Wraps a generated `xxxInfiniteOptions(...)` result with Hikka's page/pages
 * pagination strategy, flattens pages into `list`, and exposes an
 * intersection-observer `ref` that auto-loads the next page when scrolled into
 * view. Mirrors the ergonomics of the old `@hikka/react` infinite hooks.
 *
 * The error / query-key / page-param type arguments are loosened to `any` so
 * any per-operation generated options object is accepted; the page type `TPage`
 * is preserved so `list` stays correctly typed at the call site.
 */
export function useInfiniteList<TPage extends PaginatedPage>(
    infiniteOptions: UseInfiniteQueryOptions<
        TPage,
        // biome-ignore lint/suspicious/noExplicitAny: hey-api option types vary per operation
        any,
        InfiniteData<TPage>,
        // biome-ignore lint/suspicious/noExplicitAny: generated query-key type is operation-specific
        any,
        // biome-ignore lint/suspicious/noExplicitAny: page-param is `number | object` in generated options
        any
    >,
    extra?: { enabled?: boolean; initialPageParam?: number },
) {
    const { ref, inView } = useInView();

    const pageParam = paginationPageParam<TPage>();

    const query = useInfiniteQuery<
        TPage,
        Error,
        InfiniteData<TPage>,
        // biome-ignore lint/suspicious/noExplicitAny: query-key type bridged from generated options
        any,
        number
    >({
        // biome-ignore lint/suspicious/noExplicitAny: bridging generated options into the strict overload
        ...(infiniteOptions as any),
        ...pageParam,
        initialPageParam: extra?.initialPageParam ?? pageParam.initialPageParam,
        enabled: extra?.enabled,
    });

    const list = query.data?.pages.flatMap((page) => page.list) as
        | TPage['list']
        | undefined;
    const pagination = query.data?.pages.at(-1)?.pagination as
        | TPage['pagination']
        | undefined;

    useEffect(() => {
        if (inView && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    }, [
        inView,
        query.hasNextPage,
        query.isFetchingNextPage,
        query.fetchNextPage,
    ]);

    return { ...query, list, pagination, ref };
}
