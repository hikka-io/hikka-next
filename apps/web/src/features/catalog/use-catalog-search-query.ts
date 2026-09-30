import type { MainContentTypeEnum } from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useRouteSearch } from '@/utils/navigation';

import {
    type CatalogSearch,
    catalogSearchArgs,
    catalogSearchOptions,
} from './queries';

/**
 * Shared catalog query. CatalogList and CatalogListSummary call it with the
 * same URL-derived args so the query cache is reused — no duplicate requests.
 */
export function useCatalogSearchQuery(
    contentType: MainContentTypeEnum,
    size?: number,
) {
    const search = useRouteSearch<CatalogSearch>();
    const options = catalogSearchOptions(contentType, search, size);
    const queryResult = useInfiniteList(options);

    return {
        ...queryResult,
        queryKey: options.queryKey,
        args: catalogSearchArgs(contentType, search).args,
        search,
    };
}
