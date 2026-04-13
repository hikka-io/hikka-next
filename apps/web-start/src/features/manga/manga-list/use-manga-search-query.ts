'use client';

import { ContentStatusEnum, MangaMediaEnum } from '@hikka/client';
import { useSearchMangas } from '@hikka/react';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { expandSort } from '@/features/filters/sort';

import type { MangaSearch } from '@/utils/search-schemas';

/**
 * Pure function: converts URL search params into the args shape expected
 * by the Hikka manga search API. Unit-testable, reusable for SSR prefetch.
 */
export function buildMangaSearchArgs(search: MangaSearch) {
    const media_type = (search.types ?? []) as MangaMediaEnum[];
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
            sort: expandSort('manga', search.sort, search.order),
        },
        page: search.page || 1,
    };
}

/**
 * Shared query for the /manga catalog. Both MangaList and MangaListSummary
 * call this with the same URL-derived args so the TanStack Query cache is
 * reused — no duplicate network requests.
 */
export function useMangaSearchQuery(size?: number) {
    const search = useFilterSearch<MangaSearch>();
    const { args, page } = buildMangaSearchArgs(search);
    const paginationArgs = { page, size };

    const queryResult = useSearchMangas({
        args,
        paginationArgs,
        options: {
            initialPageParam: page,
        },
    });

    return { ...queryResult, args, paginationArgs, search };
}
