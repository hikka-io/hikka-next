import {
    type ContentStatusEnum,
    type NovelMediaEnum,
    paginatedInfiniteOptions,
    searchNovelInfiniteOptions,
} from '@hikka/api';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { expandSort } from '@/features/filters/sort';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import type { NovelSearch } from '@/utils/search-schemas';

/** Converts URL search params into the Hikka novel search API args shape. */
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
 * Shared /novel catalog query. NovelList and NovelListSummary call it with the
 * same URL-derived args so the query cache is reused — no duplicate requests.
 */
export function useNovelSearchQuery(size?: number) {
    const search = useFilterSearch<NovelSearch>();
    const { args, page } = buildNovelSearchArgs(search);

    const options = paginatedInfiniteOptions(
        searchNovelInfiniteOptions({ body: args, query: { size } }),
        page,
    );
    const queryResult = useInfiniteList(options);

    return { ...queryResult, queryKey: options.queryKey, args, search };
}
