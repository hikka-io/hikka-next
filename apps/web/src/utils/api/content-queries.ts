import {
    type QueryFunction,
    type QueryKey,
    queryOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';

import {
    animeSlugOptions,
    type Client,
    ContentTypeEnum,
    characterAnimeInfiniteOptions,
    characterInfoOptions,
    characterMangaInfiniteOptions,
    characterNovelInfiniteOptions,
    characterVoicesInfiniteOptions,
    type FavouriteContentTypeEnum,
    getArticleOptions,
    getCollectionOptions,
    getEditOptions,
    getFavouriteOptions,
    HikkaApiError,
    MainContentTypeEnum,
    mangaInfoOptions,
    novelInfoOptions,
    paginationPageParam,
    personAnimeInfiniteOptions,
    personInfoOptions,
    personMangaInfiniteOptions,
    personNovelInfiniteOptions,
    personVoicesInfiniteOptions,
    type ReadContentTypeEnum,
    type ReadGetError,
    type ReadGetResponse,
    readGetOptions,
    userProfileOptions,
    type WatchGetError,
    type WatchGetResponse,
    watchGetOptions,
} from '@hikka/api';

import { ensureOr404 } from './ensure-or-404';
import type { LoaderContext } from './loader-prefetch';

function nullOn404<TData, TError, TKey extends QueryKey>(
    generated: UseQueryOptions<TData, TError, TData, TKey>,
) {
    const queryFn = generated.queryFn as QueryFunction<TData, TKey>;

    return queryOptions<TData | null, TError, TData | null, TKey>({
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
        queryKey: generated.queryKey,
    });
}

const watchEntryOptions = (slug: string, client?: Client) =>
    nullOn404(watchGetOptions({ path: { slug }, client }));

const readEntryOptions = (
    content_type: ReadContentTypeEnum,
    slug: string,
    client?: Client,
) => nullOn404(readGetOptions({ path: { slug, content_type }, client }));

type WatchEntryOptions = ReturnType<typeof watchEntryOptions>;
type ReadEntryOptions = ReturnType<typeof readEntryOptions>;
type ListEntryOptions = UseQueryOptions<
    WatchGetResponse | ReadGetResponse | null,
    WatchGetError | ReadGetError
>;

/** The viewer's list entry for a title; a 404 (not tracked) resolves to `null` instead of an error. */
export function listEntryOptions(
    contentType: typeof MainContentTypeEnum.ANIME,
    slug: string,
    client?: Client,
): WatchEntryOptions;
export function listEntryOptions(
    contentType: ReadContentTypeEnum,
    slug: string,
    client?: Client,
): ReadEntryOptions;
export function listEntryOptions(
    contentType: MainContentTypeEnum,
    slug: string,
    client?: Client,
): ListEntryOptions;
export function listEntryOptions(
    contentType: MainContentTypeEnum,
    slug: string,
    client?: Client,
): WatchEntryOptions | ReadEntryOptions | ListEntryOptions {
    if (contentType === MainContentTypeEnum.ANIME) {
        return watchEntryOptions(slug, client);
    }

    return readEntryOptions(contentType, slug, client);
}

/** The viewer's favourite for an item; a 404 (not a favourite) resolves to `null` instead of an error. */
export function favouriteEntryOptions(
    content_type: FavouriteContentTypeEnum,
    slug: string,
    client?: Client,
) {
    return nullOn404(
        getFavouriteOptions({ path: { content_type, slug }, client }),
    );
}

const CONTENT_INFO_OPTIONS = {
    [ContentTypeEnum.ANIME]: (slug: string, client?: Client) =>
        animeSlugOptions({ path: { slug }, client }),
    [ContentTypeEnum.MANGA]: (slug: string, client?: Client) =>
        mangaInfoOptions({ path: { slug }, client }),
    [ContentTypeEnum.NOVEL]: (slug: string, client?: Client) =>
        novelInfoOptions({ path: { slug }, client }),
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

export async function loadContentForComments(
    type: ContentTypeEnum,
    slug: string,
    { queryClient, apiClient }: LoaderContext,
) {
    if (!isContentInfoType(type)) {
        return null;
    }

    return await ensureOr404(() =>
        queryClient.ensureQueryData(contentInfoOptions(type, slug, apiClient)),
    );
}

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
