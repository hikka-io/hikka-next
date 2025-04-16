import {
    MangaResponse,
    NovelResponse,
    ReadContentTypeEnum,
    ReadStatusEnum,
} from '@hikka/client';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '../core/useQuery';

export interface UseRandomReadEntryOptions
    extends Omit<
        UseQueryOptions<MangaResponse | NovelResponse, Error>,
        'queryKey' | 'queryFn'
    > {
    contentType: ReadContentTypeEnum;
    username: string;
    status: ReadStatusEnum;
}

/**
 * Hook for getting a random read entry from a user's list
 */
export function useRandomReadEntry(
    params: UseRandomReadEntryOptions,
): UseQueryResult<MangaResponse | NovelResponse, Error> {
    const { contentType, username, status, ...options } = params;

    return useQuery(
        ['read', contentType, 'random', username, status],
        (client) => client.read.getRandom(contentType, username, status),
        {
            enabled: !!contentType && !!username && !!status,
            ...options,
        },
    );
}
