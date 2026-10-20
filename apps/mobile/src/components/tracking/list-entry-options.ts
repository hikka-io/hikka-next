import {
    type QueryFunction,
    queryOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';

import {
    type AnimeInfoResponse,
    animeSlugOptions,
    ContentTypeEnum,
    HikkaApiError,
    type MainContentTypeEnum,
    type MangaInfoResponse,
    mangaInfoOptions,
    type NovelInfoResponse,
    novelInfoOptions,
    type ReadContentTypeEnum,
    type ReadResponse,
    readGetOptions,
    type WatchResponse,
    watchGetOptions,
} from '@hikka/api';

type ListEntryResponse = WatchResponse | ReadResponse;

/**
 * The viewer's list entry for a title. A 404 means "not in the list" and resolves to `null`;
 * every other failure stays an error, so an unreadable entry never passes for an untracked one.
 */
export const listEntryOptions = (
    contentType: MainContentTypeEnum,
    slug: string,
) => {
    const generated =
        contentType === ContentTypeEnum.ANIME
            ? watchGetOptions({ path: { slug } })
            : readGetOptions({
                  path: {
                      content_type: contentType as ReadContentTypeEnum,
                      slug,
                  },
              });
    const queryFn = generated.queryFn as QueryFunction<ListEntryResponse>;

    return queryOptions<ListEntryResponse | null, Error>({
        queryKey: generated.queryKey,
        queryFn: async (context) => {
            try {
                return await queryFn(context);
            } catch (error) {
                if (error instanceof HikkaApiError && error.status === 404) {
                    return null;
                }
                throw error;
            }
        },
    });
};

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
