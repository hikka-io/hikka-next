import type { UseQueryOptions } from '@tanstack/react-query';

import {
    type AnimeInfoResponse,
    animeSlugOptions,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type MangaInfoResponse,
    mangaInfoOptions,
    type NovelInfoResponse,
    novelInfoOptions,
} from '@hikka/api';

export type ContentInfo =
    | AnimeInfoResponse
    | MangaInfoResponse
    | NovelInfoResponse;

/** Title and totals for the edit sheet: the same query the detail page loads. */
export const contentInfoOptions = (
    contentType: MainContentTypeEnum,
    slug: string,
): UseQueryOptions<ContentInfo, Error> => {
    switch (contentType) {
        case ContentTypeEnum.ANIME:
            return animeSlugOptions({ path: { slug } }) as UseQueryOptions<
                ContentInfo,
                Error
            >;
        case ContentTypeEnum.MANGA:
            return mangaInfoOptions({ path: { slug } }) as UseQueryOptions<
                ContentInfo,
                Error
            >;
        default:
            return novelInfoOptions({ path: { slug } }) as UseQueryOptions<
                ContentInfo,
                Error
            >;
    }
};
