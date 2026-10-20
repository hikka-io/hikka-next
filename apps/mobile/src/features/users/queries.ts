import {
    type ContentTypeEnum,
    type FavouriteContentTypeEnum,
    favouriteListInfiniteOptions,
    followStatsOptions,
    paginationPageParam,
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
) => ({
    ...favouriteListInfiniteOptions({
        path: { username, content_type: contentType },
        query: { size: FAVOURITES_PAGE_SIZE },
    }),
    ...paginationPageParam(),
});

export const userHistoryPreviewOptions = (username: string) => ({
    ...userHistoryInfiniteOptions({
        path: { username },
        query: { size: HISTORY_PREVIEW_SIZE },
    }),
    ...paginationPageParam(),
});
