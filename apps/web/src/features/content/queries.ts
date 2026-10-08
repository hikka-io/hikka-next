import type {
    InfiniteData,
    QueryKey,
    UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
    animeCharactersInfiniteOptions,
    animeStaffInfiniteOptions,
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
    mangaCharactersInfiniteOptions,
    novelCharactersInfiniteOptions,
    paginationPageParam,
    type RelatedContentTypeEnum,
} from '@hikka/api';

export const FOLLOWING_PREVIEW_SIZE = 3;
export const COLLECTIONS_PREVIEW_SIZE = 3;
export const ARTICLES_PREVIEW_SIZE = 3;

const CONTENT_CHARACTERS = {
    [ContentTypeEnum.ANIME]: animeCharactersInfiniteOptions,
    [ContentTypeEnum.MANGA]: mangaCharactersInfiniteOptions,
    [ContentTypeEnum.NOVEL]: novelCharactersInfiniteOptions,
} satisfies Record<MainContentTypeEnum, unknown>;

export function contentRelatedFranchiseOptions(
    content_type: RelatedContentTypeEnum,
    slug: string,
    client?: Client,
) {
    return contentFranchiseOptions({ path: { slug, content_type }, client });
}

export function contentCharactersOptions(
    content_type: MainContentTypeEnum,
    slug: string,
    client?: Client,
) {
    // The three endpoints share one page type, so one options type covers them.
    const build = CONTENT_CHARACTERS[
        content_type
    ] as typeof animeCharactersInfiniteOptions;

    return {
        ...build({ path: { slug }, client }),
        ...paginationPageParam(),
    };
}

export function animeStaffOptions(slug: string, client?: Client) {
    return {
        ...animeStaffInfiniteOptions({ path: { slug }, client }),
        ...paginationPageParam(),
    };
}

type FollowingPage = GetWatchFollowingResponse | GetReadFollowingResponse;

type FollowingOptions = UseInfiniteQueryOptions<
    FollowingPage,
    GetWatchFollowingError | GetReadFollowingError,
    InfiniteData<FollowingPage>,
    QueryKey,
    number
>;

export function contentFollowingOptions(
    content_type: MainContentTypeEnum,
    slug: string,
    { preview = false }: { preview?: boolean } = {},
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

    return {
        ...(options as unknown as FollowingOptions),
        ...paginationPageParam(),
    };
}

export function contentCollectionsOptions(
    content_type: CollectionContentTypeEnum,
    slug: string,
    { preview = false }: { preview?: boolean } = {},
    client?: Client,
) {
    return {
        ...getCollectionsInfiniteOptions({
            body: { content_type, content: [slug] },
            query: preview ? { size: COLLECTIONS_PREVIEW_SIZE } : undefined,
            client,
        }),
        ...paginationPageParam(),
    };
}

export function contentArticlesOptions(
    content_type: MainContentTypeEnum,
    slug: string,
    { preview = false }: { preview?: boolean } = {},
    client?: Client,
) {
    return {
        ...getArticlesInfiniteOptions({
            body: { content_type, content_slug: slug },
            query: preview ? { size: ARTICLES_PREVIEW_SIZE } : undefined,
            client,
        }),
        ...paginationPageParam(),
    };
}
