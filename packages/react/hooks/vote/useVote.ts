import { VoteContentTypeEnum, VoteResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for getting vote status for content
 */
export function useVoteStatus(
    contentType: VoteContentTypeEnum,
    slug: string,
    options?: Omit<
        UseQueryOptions<VoteResponse, Error, VoteResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.vote.status(contentType, slug),
        queryFn: (client) => client.vote.getVote(contentType, slug),
        options: options || {},
    });
}

/**
 * Hook for prefetching vote status
 */
export async function prefetchVoteStatus(
    queryClient: QueryClient,
    contentType: VoteContentTypeEnum,
    slug: string,
    options?: Omit<
        FetchQueryOptions<VoteResponse, Error, VoteResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.vote.status(contentType, slug),
        queryFn: (client) => client.vote.getVote(contentType, slug),
        options: options || {},
    });
}
