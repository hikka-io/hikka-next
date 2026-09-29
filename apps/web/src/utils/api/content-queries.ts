import type { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import {
    animeSlugOptions,
    type Client,
    ContentTypeEnum,
    characterInfoOptions,
    getArticleOptions,
    getCollectionOptions,
    getEditOptions,
    MainContentTypeEnum,
    mangaInfoOptions,
    novelInfoOptions,
    personInfoOptions,
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

type WatchEntryOptions = ReturnType<typeof watchGetOptions>;
type ReadEntryOptions = ReturnType<typeof readGetOptions>;
type ListEntryOptions = UseQueryOptions<
    WatchGetResponse | ReadGetResponse,
    WatchGetError | ReadGetError
>;

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
        return watchGetOptions({ path: { slug }, client });
    }

    return readGetOptions({
        path: { slug, content_type: contentType },
        client,
    });
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

const isContentInfoType = (type: string): type is ContentInfoType =>
    Object.hasOwn(CONTENT_INFO_OPTIONS, type);

type LoaderContext = {
    queryClient: QueryClient;
    apiClient: Client;
};

export async function fetchContentForLoader(
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
