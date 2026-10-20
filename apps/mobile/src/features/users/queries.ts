import { useInfiniteQuery } from '@tanstack/react-query';

import {
    type ContentTypeEnum,
    type FavouriteContentTypeEnum,
    favouriteListInfiniteOptions,
    followStatsOptions,
    paginatedInfiniteOptions,
    serviceUserStatsOptions,
    userHistoryInfiniteOptions,
    userProfileOptions,
    userReadStatsOptions,
    userReferenceOptions,
    userWatchStatsOptions,
} from '@hikka/api';

export const FAVOURITES_PAGE_SIZE = 12;
export const HISTORY_PREVIEW_SIZE = 3;

export type ListContentType =
    | typeof ContentTypeEnum.ANIME
    | typeof ContentTypeEnum.MANGA
    | typeof ContentTypeEnum.NOVEL;

export {
    followStatsOptions,
    serviceUserStatsOptions,
    userProfileOptions,
    userReferenceOptions,
};

export const userWatchListStatsOptions = (username: string) =>
    userWatchStatsOptions({ path: { username } });

export const userReadListStatsOptions = (
    username: string,
    contentType: Exclude<ListContentType, 'anime'>,
) => userReadStatsOptions({ path: { username, content_type: contentType } });

export const userFavouritesOptions = (
    username: string,
    contentType: FavouriteContentTypeEnum,
) =>
    paginatedInfiniteOptions(
        favouriteListInfiniteOptions({
            path: { username, content_type: contentType },
            query: { size: FAVOURITES_PAGE_SIZE },
        }),
    );

export const userHistoryPreviewOptions = (username: string) =>
    paginatedInfiniteOptions(
        userHistoryInfiniteOptions({
            path: { username },
            query: { size: HISTORY_PREVIEW_SIZE },
        }),
    );

// The favourites endpoint returns a different item type per content type; the strip only needs the shared list shape.
export function useFavouritesList<T>(
    username: string,
    contentType: FavouriteContentTypeEnum,
) {
    const query = useInfiniteQuery(
        userFavouritesOptions(username, contentType) as never,
    ) as unknown as {
        data?: { pages: { list: T[] }[] };
        isPending: boolean;
        error: unknown;
        hasNextPage: boolean;
        isFetchingNextPage: boolean;
        fetchNextPage: () => Promise<unknown>;
        refetch: () => Promise<unknown>;
    };

    return {
        list: query.data?.pages.flatMap((page) => page.list),
        isPending: query.isPending,
        error: query.error,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: () => void query.fetchNextPage(),
        refetch: () => void query.refetch(),
    };
}
