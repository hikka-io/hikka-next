import {
    MangaResponse,
    NovelResponse,
    ReadContentTypeEnum,
    ReadStatusEnum,
} from '@hikka/client';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '../core/useQuery';

interface UseRandomReadEntryParams {
    contentType: ReadContentTypeEnum;
    username: string;
    status: ReadStatusEnum;
}

/**
 * Hook for getting a random read entry from a user's list
 */
export function useRandomReadEntry(
    params: UseRandomReadEntryParams,
    options?: Omit<
        UseQueryOptions<MangaResponse | NovelResponse, Error>,
        'queryKey' | 'queryFn'
    >,
): UseQueryResult<MangaResponse | NovelResponse, Error> {
    const { contentType, username, status } = params;

    return useQuery(
        ['read', contentType, 'random', username, status],
        (client) => client.read.getRandom(contentType, username, status),
        {
            enabled: !!contentType && !!username && !!status,
            ...options,
        },
    );
}
