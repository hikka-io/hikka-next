import type { UseQueryOptions } from '@tanstack/react-query';

import {
    animeCharactersOptions,
    animeRecommendationsOptions,
    animeSlugOptions,
    animeStaffOptions,
    type Client,
    ContentTypeEnum,
    contentFranchiseOptions,
    type MainContentTypeEnum,
    mangaCharactersOptions,
    mangaInfoOptions,
    novelCharactersOptions,
    novelInfoOptions,
} from '@hikka/api';

export const CHARACTERS_PREVIEW_SIZE = 15;
export const STAFF_PREVIEW_SIZE = 15;
export const RECOMMENDATIONS_PREVIEW_SIZE = 15;

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
