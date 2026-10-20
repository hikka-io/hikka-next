import type {
    InfiniteData,
    QueryKey,
    UseInfiniteQueryOptions,
    UseQueryOptions,
} from '@tanstack/react-query';

import {
    animeCharactersOptions,
    animeRecommendationsOptions,
    animeSlugOptions,
    animeStaffOptions,
    type Client,
    type CollectionContentTypeEnum,
    ContentTypeEnum,
    contentFranchiseOptions,
    type GetReadFollowingError,
    type GetReadFollowingResponse,
    type GetWatchFollowingError,
    type GetWatchFollowingResponse,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    getReadFollowingInfiniteOptions,
    getWatchFollowingInfiniteOptions,
    type MainContentTypeEnum,
    mangaCharactersOptions,
    mangaInfoOptions,
    novelCharactersOptions,
    novelInfoOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';
import {
    contentArticlesListArgs,
    contentCollectionsListArgs,
} from '@hikka/core';

export const CHARACTERS_PREVIEW_SIZE = 15;
export const STAFF_PREVIEW_SIZE = 15;
export const RECOMMENDATIONS_PREVIEW_SIZE = 15;
export const FOLLOWING_PREVIEW_SIZE = 3;
// Backend page size of the full following list, which sends no `size`, like the web's sheet.
export const FOLLOWING_PAGE_SIZE = 15;
export const COLLECTIONS_PREVIEW_SIZE = 3;
export const ARTICLES_PREVIEW_SIZE = 3;

const CONTENT_INFO = {
    [ContentTypeEnum.ANIME]: (slug: string, client?: Client) =>
        animeSlugOptions({ path: { slug }, client }),
    [ContentTypeEnum.MANGA]: (slug: string, client?: Client) =>
        mangaInfoOptions({ path: { slug }, client }),
    [ContentTypeEnum.NOVEL]: (slug: string, client?: Client) =>
        novelInfoOptions({ path: { slug }, client }),
} satisfies Record<MainContentTypeEnum, unknown>;

type ContentInfoFactory<T extends MainContentTypeEnum> = ReturnType<
    (typeof CONTENT_INFO)[T]
>;

export type ContentInfo<T extends MainContentTypeEnum = MainContentTypeEnum> =
    Awaited<ReturnType<NonNullable<ContentInfoFactory<T>['queryFn']>>>;

type ContentInfoOptions<T extends MainContentTypeEnum> = UseQueryOptions<
    ContentInfo<T>,
    Error,
    ContentInfo<T>,
    ContentInfoFactory<T>['queryKey']
>;

export function contentInfoOptions<T extends MainContentTypeEnum>(
    content_type: T,
    slug: string,
    client?: Client,
): ContentInfoOptions<T> {
    return CONTENT_INFO[content_type](slug, client) as ContentInfoOptions<T>;
}

const CONTENT_CHARACTERS = {
    [ContentTypeEnum.ANIME]: animeCharactersOptions,
    [ContentTypeEnum.MANGA]: mangaCharactersOptions,
    [ContentTypeEnum.NOVEL]: novelCharactersOptions,
} satisfies Record<MainContentTypeEnum, unknown>;

export function contentCharactersPreviewOptions(
    content_type: MainContentTypeEnum,
    slug: string,
    client?: Client,
) {
    // The three endpoints share one page type, so one options type covers them.
    const build = CONTENT_CHARACTERS[
        content_type
    ] as typeof animeCharactersOptions;

    return build({
        path: { slug },
        query: { size: CHARACTERS_PREVIEW_SIZE },
        client,
    });
}

export function animeStaffPreviewOptions(slug: string, client?: Client) {
    return animeStaffOptions({
        path: { slug },
        query: { size: STAFF_PREVIEW_SIZE },
        client,
    });
}

export function animeRecommendationsPreviewOptions(
    slug: string,
    client?: Client,
) {
    return animeRecommendationsOptions({
        path: { slug },
        query: { size: RECOMMENDATIONS_PREVIEW_SIZE },
        client,
    });
}

export function contentRelatedFranchiseOptions(
    content_type: MainContentTypeEnum,
    slug: string,
    client?: Client,
) {
    return contentFranchiseOptions({ path: { slug, content_type }, client });
}

type PreviewFlag = { preview?: boolean };

type FollowingPage = GetWatchFollowingResponse | GetReadFollowingResponse;

type FollowingOptions = UseInfiniteQueryOptions<
    FollowingPage,
    GetWatchFollowingError | GetReadFollowingError,
    InfiniteData<FollowingPage>,
    QueryKey,
    number
>;

/** Users the viewer follows who track the title; the preview and the full list differ in the key only by the size. */
export function contentFollowingOptions(
    content_type: MainContentTypeEnum,
    slug: string,
    { preview = false }: PreviewFlag = {},
    client?: Client,
): FollowingOptions {
    const query = preview ? { size: FOLLOWING_PREVIEW_SIZE } : undefined;
    const options =
        content_type === ContentTypeEnum.ANIME
            ? getWatchFollowingInfiniteOptions({
                  path: { slug },
                  query,
                  client,
              })
            : getReadFollowingInfiniteOptions({
                  path: { slug, content_type },
                  query,
                  client,
              });

    return paginatedInfiniteOptions(options) as unknown as FollowingOptions;
}

/** The collections that contain a title, character or person. */
export function contentCollectionsOptions(
    content_type: CollectionContentTypeEnum,
    slug: string,
    { preview = false }: PreviewFlag = {},
    client?: Client,
) {
    return paginatedInfiniteOptions(
        getCollectionsInfiniteOptions({
            body: contentCollectionsListArgs(content_type, slug),
            query: preview ? { size: COLLECTIONS_PREVIEW_SIZE } : undefined,
            client,
        }),
    );
}

/** The articles about a title. */
export function contentArticlesOptions(
    content_type: MainContentTypeEnum,
    slug: string,
    { preview = false }: PreviewFlag = {},
    client?: Client,
) {
    return paginatedInfiniteOptions(
        getArticlesInfiniteOptions({
            body: contentArticlesListArgs(content_type, slug),
            query: preview ? { size: ARTICLES_PREVIEW_SIZE } : undefined,
            client,
        }),
    );
}
