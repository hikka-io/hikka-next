import {
    type ContentStatusEnum,
    type MangaMediaEnum,
    paginatedInfiniteOptions,
    searchMangaInfiniteOptions,
} from '@hikka/api';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { expandSort } from '@/features/filters/sort';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import type { MangaSearch } from '@/utils/search-schemas';

/** Converts URL search params into the Hikka manga search API args shape. */
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
 * Shared /manga catalog query. MangaList and MangaListSummary call it with the
 * same URL-derived args so the query cache is reused — no duplicate requests.
 */
export function useMangaSearchQuery(size?: number) {
    const search = useFilterSearch<MangaSearch>();
    const { args, page } = buildMangaSearchArgs(search);

    const options = paginatedInfiniteOptions(
        searchMangaInfiniteOptions({ body: args, query: { size } }),
        page,
    );
    const queryResult = useInfiniteList(options);

    return { ...queryResult, queryKey: options.queryKey, args, search };
}
