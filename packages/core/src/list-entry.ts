import type {
    DataTag,
    QueryFunction,
    QueryKey,
    SkipToken,
} from '@tanstack/query-core';

import {
    type Client,
    HikkaApiError,
    MainContentTypeEnum,
    type ReadContentTypeEnum,
    type ReadGetError,
    type ReadGetResponse,
    readGetOptions,
    type WatchGetError,
    type WatchGetResponse,
    watchGetOptions,
} from '@hikka/api';

type NullOn404Options<TData, TError, TKey extends QueryKey> = {
    queryFn: QueryFunction<TData | null, TKey>;
    queryKey: DataTag<TKey, TData | null, TError>;
};

/** A 404 resolves to `null` instead of an error; every other failure still throws. */
export function nullOn404<TData, TError, TKey extends QueryKey>(generated: {
    queryKey: TKey;
    queryFn?: QueryFunction<TData, TKey> | SkipToken;
}): NullOn404Options<TData, TError, TKey> {
    const queryFn = generated.queryFn as QueryFunction<TData, TKey>;

    return {
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
        queryKey: generated.queryKey as DataTag<TKey, TData | null, TError>,
    };
}

type WatchEntryOptions = NullOn404Options<
    WatchGetResponse,
    WatchGetError,
    ReturnType<typeof watchGetOptions>['queryKey']
>;
type ReadEntryOptions = NullOn404Options<
    ReadGetResponse,
    ReadGetError,
    ReturnType<typeof readGetOptions>['queryKey']
>;

// For a content type only known at runtime: one options type `useQuery` can infer from.
type ListEntryOptions = NullOn404Options<
    WatchGetResponse | ReadGetResponse,
    WatchGetError | ReadGetError,
    QueryKey
>;

const watchEntryOptions = (slug: string, client?: Client): WatchEntryOptions =>
    nullOn404(watchGetOptions({ path: { slug }, client }));

const readEntryOptions = (
    content_type: ReadContentTypeEnum,
    slug: string,
    client?: Client,
): ReadEntryOptions =>
    nullOn404(readGetOptions({ path: { slug, content_type }, client }));

/**
 * The viewer's list entry for a title: the entry, `null` when untracked (404), an error
 * otherwise. An unreadable entry must never pass for an untracked one: a write built from
 * it would replace the whole entry.
 */
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
