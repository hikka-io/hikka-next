import type {
    InfiniteData,
    UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
    type AnimeResponseWithWatch,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type MangaResponseWithRead,
    type NovelResponseWithRead,
    type PaginationResponse,
    paginatedInfiniteOptions,
    searchAnimeInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
} from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useRouteSearch } from '@/utils/navigation';
import type {
    AnimeSearch,
    MangaSearch,
    NovelSearch,
} from '@/utils/search-schemas';

import {
    buildAnimeSearchArgs,
    buildMangaSearchArgs,
    buildNovelSearchArgs,
} from './search-args';

export type CatalogItems = {
    [ContentTypeEnum.ANIME]: AnimeResponseWithWatch;
    [ContentTypeEnum.MANGA]: MangaResponseWithRead;
    [ContentTypeEnum.NOVEL]: NovelResponseWithRead;
};

type CatalogSearch = AnimeSearch | MangaSearch | NovelSearch;

type CatalogSearchPage = {
    list: CatalogItems[MainContentTypeEnum][];
    pagination: PaginationResponse;
};

type CatalogSearchOptions = UseInfiniteQueryOptions<
    CatalogSearchPage,
    Error,
    InfiniteData<CatalogSearchPage>
>;

function catalogSearchOptions(
    contentType: MainContentTypeEnum,
    search: CatalogSearch,
    size?: number,
) {
    switch (contentType) {
        case ContentTypeEnum.ANIME: {
            const { args, page } = buildAnimeSearchArgs(search);

            return {
                args,
                options: paginatedInfiniteOptions(
                    searchAnimeInfiniteOptions({ body: args, query: { size } }),
                    page,
                ),
            };
        }
        case ContentTypeEnum.MANGA: {
            const { args, page } = buildMangaSearchArgs(search);

            return {
                args,
                options: paginatedInfiniteOptions(
                    searchMangaInfiniteOptions({ body: args, query: { size } }),
                    page,
                ),
            };
        }
        case ContentTypeEnum.NOVEL: {
            const { args, page } = buildNovelSearchArgs(search);

            return {
                args,
                options: paginatedInfiniteOptions(
                    searchNovelInfiniteOptions({ body: args, query: { size } }),
                    page,
                ),
            };
        }
    }
}

/**
 * Shared catalog query. CatalogList and CatalogListSummary call it with the
 * same URL-derived args so the query cache is reused — no duplicate requests.
 */
export function useCatalogSearchQuery(
    contentType: MainContentTypeEnum,
    size?: number,
) {
    const search = useRouteSearch<CatalogSearch>();
    const { args, options } = catalogSearchOptions(contentType, search, size);
    const queryResult = useInfiniteList(options as CatalogSearchOptions);

    return { ...queryResult, queryKey: options.queryKey, args, search };
}
