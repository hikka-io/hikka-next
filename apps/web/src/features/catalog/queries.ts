import type {
    InfiniteData,
    UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
    type AnimeResponseWithWatch,
    type Client,
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

import { awaitOnServer, type LoaderContext } from '@/utils/api/loader-prefetch';
import {
    CATALOG_FILTERS_SIDEBAR_KEY,
    readUiPrefs,
    type UiPreferences,
} from '@/utils/cookies';
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

export const CATALOG_VIEW_KEY = 'catalog';

export type CatalogItems = {
    [ContentTypeEnum.ANIME]: AnimeResponseWithWatch;
    [ContentTypeEnum.MANGA]: MangaResponseWithRead;
    [ContentTypeEnum.NOVEL]: NovelResponseWithRead;
};

export type CatalogSearch = AnimeSearch | MangaSearch | NovelSearch;

type CatalogSearchPage = {
    list: CatalogItems[MainContentTypeEnum][];
    pagination: PaginationResponse;
};

type CatalogSearchOptions = UseInfiniteQueryOptions<
    CatalogSearchPage,
    Error,
    InfiniteData<CatalogSearchPage>,
    readonly unknown[],
    number
> & { initialPageParam: number };

type CatalogLayoutPrefs = Pick<UiPreferences, 'views' | 'collapsibles'>;

export function catalogColumns(
    prefs: CatalogLayoutPrefs | null,
    key: string,
): 1 | 5 | 7 {
    if (prefs?.views[key] === 'list') return 1;

    return (prefs?.collapsibles[CATALOG_FILTERS_SIDEBAR_KEY] ?? true) ? 5 : 7;
}

/** The page size is part of the query key, so the loader and the page both derive it here. */
export function catalogPageSize(
    prefs: CatalogLayoutPrefs | null,
    key: string,
): number | undefined {
    const columns = catalogColumns(prefs, key);

    return columns === 1 ? undefined : columns * 4;
}

export function catalogSearchArgs(
    contentType: MainContentTypeEnum,
    search: CatalogSearch,
) {
    switch (contentType) {
        case ContentTypeEnum.ANIME:
            return buildAnimeSearchArgs(search);
        case ContentTypeEnum.MANGA:
            return buildMangaSearchArgs(search);
        case ContentTypeEnum.NOVEL:
            return buildNovelSearchArgs(search);
    }
}

export function catalogSearchOptions(
    contentType: MainContentTypeEnum,
    search: CatalogSearch,
    size?: number,
    client?: Client,
): CatalogSearchOptions {
    switch (contentType) {
        case ContentTypeEnum.ANIME: {
            const { args, page } = buildAnimeSearchArgs(search);

            return paginatedInfiniteOptions(
                searchAnimeInfiniteOptions({
                    body: args,
                    query: { size },
                    client,
                }),
                page,
            ) as CatalogSearchOptions;
        }
        case ContentTypeEnum.MANGA: {
            const { args, page } = buildMangaSearchArgs(search);

            return paginatedInfiniteOptions(
                searchMangaInfiniteOptions({
                    body: args,
                    query: { size },
                    client,
                }),
                page,
            ) as CatalogSearchOptions;
        }
        case ContentTypeEnum.NOVEL: {
            const { args, page } = buildNovelSearchArgs(search);

            return paginatedInfiniteOptions(
                searchNovelInfiniteOptions({
                    body: args,
                    query: { size },
                    client,
                }),
                page,
            ) as CatalogSearchOptions;
        }
    }
}

async function prefetchCatalogFirstPage(
    contentType: MainContentTypeEnum,
    search: CatalogSearch,
    { queryClient, apiClient }: LoaderContext,
) {
    let prefs: UiPreferences | null;
    try {
        prefs = await readUiPrefs();
    } catch {
        return;
    }

    await queryClient.prefetchInfiniteQuery(
        catalogSearchOptions(
            contentType,
            search,
            catalogPageSize(prefs, CATALOG_VIEW_KEY),
            apiClient,
        ),
    );
}

export async function loadCatalogFirstPage(
    {
        contentType,
        search,
        preload,
    }: {
        contentType: MainContentTypeEnum;
        search: CatalogSearch;
        preload: boolean;
    },
    ctx: LoaderContext,
) {
    if (preload) return;

    await awaitOnServer([prefetchCatalogFirstPage(contentType, search, ctx)]);
}
