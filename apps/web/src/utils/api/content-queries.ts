import type { UseQueryOptions } from '@tanstack/react-query';

import {
    animeSlugOptions,
    type Client,
    ContentTypeEnum,
    characterAnimeInfiniteOptions,
    characterInfoOptions,
    characterMangaInfiniteOptions,
    characterNovelInfiniteOptions,
    characterVoicesInfiniteOptions,
    type ExternalResponse,
    getArticleOptions,
    getAuthToken,
    getBrowserClient,
    getCollectionOptions,
    getEditOptions,
    mangaInfoOptions,
    novelInfoOptions,
    paginationPageParam,
    personAnimeInfiniteOptions,
    personInfoOptions,
    personMangaInfiniteOptions,
    personNovelInfiniteOptions,
    personVoicesInfiniteOptions,
    userProfileOptions,
} from '@hikka/api';
import { favouriteEntryOptions, listEntryOptions } from '@hikka/core';

import { stripRestrictedExternal } from './strip-restricted-external';

export { favouriteEntryOptions, listEntryOptions };

// SSR request clients are stripped by the detail loader, which knows the session.
const isAnonymousBrowserFetch = (client?: Client) =>
    (!client || client === getBrowserClient()) && !getAuthToken();

type WithExternal = { external: ExternalResponse[] };

function withoutAnonymousRestrictedExternal<
    O extends {
        queryFn?: (context: never) => WithExternal | Promise<WithExternal>;
    },
>(options: O, client?: Client): O {
    const { queryFn } = options;
    if (!queryFn) return options;

    return {
        ...options,
        queryFn: async (context: Parameters<typeof queryFn>[0]) => {
            const data = await queryFn(context);
            return isAnonymousBrowserFetch(client)
                ? stripRestrictedExternal(data)
                : data;
        },
    };
}

const CONTENT_INFO_OPTIONS = {
    [ContentTypeEnum.ANIME]: (slug: string, client?: Client) =>
        withoutAnonymousRestrictedExternal(
            animeSlugOptions({ path: { slug }, client }),
            client,
        ),
    [ContentTypeEnum.MANGA]: (slug: string, client?: Client) =>
        withoutAnonymousRestrictedExternal(
            mangaInfoOptions({ path: { slug }, client }),
            client,
        ),
    [ContentTypeEnum.NOVEL]: (slug: string, client?: Client) =>
        withoutAnonymousRestrictedExternal(
            novelInfoOptions({ path: { slug }, client }),
            client,
        ),
    [ContentTypeEnum.CHARACTER]: (slug: string, client?: Client) =>
        characterInfoOptions({ path: { slug }, client }),
    [ContentTypeEnum.PERSON]: (slug: string, client?: Client) =>
        personInfoOptions({ path: { slug }, client }),
    [ContentTypeEnum.COLLECTION]: (slug: string, client?: Client) =>
        getCollectionOptions({ path: { reference: slug }, client }),
    [ContentTypeEnum.EDIT]: (slug: string, client?: Client) =>
        getEditOptions({ path: { edit_id: Number(slug) }, client }),
    [ContentTypeEnum.ARTICLE]: (slug: string, client?: Client) =>
        getArticleOptions({ path: { slug }, client }),
    [ContentTypeEnum.USER]: (slug: string, client?: Client) =>
        userProfileOptions({ path: { username: slug }, client }),
};

export type ContentInfoType = keyof typeof CONTENT_INFO_OPTIONS;

type ContentInfoFactoryOptions<T extends ContentInfoType> = ReturnType<
    (typeof CONTENT_INFO_OPTIONS)[T]
>;

export type ContentInfo<T extends ContentInfoType> = Awaited<
    ReturnType<NonNullable<ContentInfoFactoryOptions<T>['queryFn']>>
>;

type ContentInfoError<T extends ContentInfoType> = Parameters<
    Extract<
        NonNullable<ContentInfoFactoryOptions<T>['throwOnError']>,
        (...args: never[]) => boolean
    >
>[0];

type ContentInfoOptions<T extends ContentInfoType> = UseQueryOptions<
    ContentInfo<T>,
    ContentInfoError<T>,
    ContentInfo<T>,
    ContentInfoFactoryOptions<T>['queryKey']
>;

export function contentInfoOptions<T extends ContentInfoType>(
    type: T,
    slug: string,
    client?: Client,
): ContentInfoOptions<T> {
    // A union of the generated option objects can't be passed to useQuery; one options type over the union can.
    return CONTENT_INFO_OPTIONS[type](slug, client) as ContentInfoOptions<T>;
}

export const isContentInfoType = (type: string): type is ContentInfoType =>
    Object.hasOwn(CONTENT_INFO_OPTIONS, type);

export const ENTITY_PREVIEW_SIZE = 4;

const ENTITY_APPEARANCES = {
    [ContentTypeEnum.CHARACTER]: {
        anime: characterAnimeInfiniteOptions,
        manga: characterMangaInfiniteOptions,
        novel: characterNovelInfiniteOptions,
        voices: characterVoicesInfiniteOptions,
    },
    [ContentTypeEnum.PERSON]: {
        anime: personAnimeInfiniteOptions,
        manga: personMangaInfiniteOptions,
        novel: personNovelInfiniteOptions,
        voices: personVoicesInfiniteOptions,
    },
};

type EntityAppearances = typeof ENTITY_APPEARANCES;

export type EntityType = keyof EntityAppearances;

export type EntityAppearanceList = keyof EntityAppearances[EntityType];

export const ENTITY_APPEARANCE_LISTS = [
    'anime',
    'manga',
    'novel',
    'voices',
] as const satisfies readonly EntityAppearanceList[];

type AppearanceBuilder = (options: {
    path: { slug: string };
    query?: { size: number };
    client?: Client;
}) => unknown;

/** The overview previews show the first page at `ENTITY_PREVIEW_SIZE`; the tabs page through the full list. */
export function entityAppearanceOptions<
    T extends EntityType,
    L extends EntityAppearanceList,
>(
    type: T,
    list: L,
    slug: string,
    { preview = false }: { preview?: boolean } = {},
    client?: Client,
): ReturnType<EntityAppearances[T][L]> {
    const build = ENTITY_APPEARANCES[type][list] as AppearanceBuilder;

    return {
        ...(build({
            path: { slug },
            ...(preview ? { query: { size: ENTITY_PREVIEW_SIZE } } : {}),
            client,
        }) as object),
        ...paginationPageParam(),
    } as ReturnType<EntityAppearances[T][L]>;
}
