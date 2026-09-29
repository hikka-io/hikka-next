import type { UseQueryOptions } from '@tanstack/react-query';

import {
    type Client,
    MainContentTypeEnum,
    type ReadContentTypeEnum,
    type ReadGetError,
    type ReadGetResponse,
    readGetOptions,
    type WatchGetError,
    type WatchGetResponse,
    watchGetOptions,
} from '@hikka/api';

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
