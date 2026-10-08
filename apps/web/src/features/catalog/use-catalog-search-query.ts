import type { MainContentTypeEnum } from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useRouteSearch } from '@/utils/navigation';

import { type CatalogSearch, catalogSearchQuery } from './queries';

/**
 * Shared catalog query. CatalogList and CatalogListSummary call it with the
 * same URL-derived args so the query cache is reused — no duplicate requests.
 */
export function useCatalogSearchQuery(
    contentType: MainContentTypeEnum,
    size?: number,
) {
    const search = useRouteSearch<CatalogSearch>();
    const { args, options } = catalogSearchQuery(contentType, search, size);
    const queryResult = useInfiniteList(options);

    return {
        ...queryResult,
        queryKey: options.queryKey,
        args,
        search,
    };
}
