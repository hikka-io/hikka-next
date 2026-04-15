'use client';

import { ContentStatusEnum, NovelMediaEnum } from '@hikka/client';
import { useSearchNovels } from '@hikka/react';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { expandSort } from '@/features/filters/sort';

import type { NovelSearch } from '@/utils/search-schemas';

/**
 * Pure function: converts URL search params into the args shape expected
 * by the Hikka novel search API. Unit-testable, reusable for SSR prefetch.
 */
export function buildNovelSearchArgs(search: NovelSearch) {
    const media_type = (search.types ?? []) as NovelMediaEnum[];
    const status = (search.statuses ?? []) as ContentStatusEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;
    const only_translated = search.only_translated;

    return {
        args: {
            query: search.search || undefined,
            media_type,
            status,
            years,
            genres,
            score,
            only_translated: Boolean(only_translated),
            sort: expandSort('novel', search.sort, search.order),
        },
        page: search.page || 1,
    };
}

/**
 * Shared query for the /novel catalog. Both NovelList and NovelListSummary
 * call this with the same URL-derived args so the TanStack Query cache is
 * reused — no duplicate network requests.
 */
export function useNovelSearchQuery(size?: number) {
    const search = useFilterSearch<NovelSearch>();
    const { args, page } = buildNovelSearchArgs(search);
    const paginationArgs = { page, size };

    const queryResult = useSearchNovels({
        args,
        paginationArgs,
        options: {
            initialPageParam: page,
        },
    });

    return { ...queryResult, args, paginationArgs, search };
}
