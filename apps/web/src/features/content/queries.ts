import {
    animeCharactersInfiniteOptions,
    animeStaffInfiniteOptions,
    type Client,
    ContentTypeEnum,
    contentFranchiseOptions,
    type MainContentTypeEnum,
    mangaCharactersInfiniteOptions,
    novelCharactersInfiniteOptions,
    paginationPageParam,
    type RelatedContentTypeEnum,
} from '@hikka/api';

const CONTENT_CHARACTERS = {
    [ContentTypeEnum.ANIME]: animeCharactersInfiniteOptions,
    [ContentTypeEnum.MANGA]: mangaCharactersInfiniteOptions,
    [ContentTypeEnum.NOVEL]: novelCharactersInfiniteOptions,
} satisfies Record<MainContentTypeEnum, unknown>;

export const franchiseOptions = (
    content_type: RelatedContentTypeEnum,
    slug: string,
    client?: Client,
) => contentFranchiseOptions({ path: { slug, content_type }, client });

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
