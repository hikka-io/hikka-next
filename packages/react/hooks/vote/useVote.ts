import { VoteContentTypeEnum, VoteResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseVoteOptions
    extends Omit<
        UseQueryOptions<
            VoteResponse,
            Error,
            VoteResponse,
            ReturnType<typeof queryKeys.vote.get>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting vote status for content
 */
export function useVote(
    contentType: VoteContentTypeEnum,
    slug: string,
    options: UseVoteOptions = {},
) {
    return useQuery(
        queryKeys.vote.get(contentType, slug),
        (client) => client.vote.getVote(contentType, slug),
        {
            enabled: !!contentType && !!slug,
            ...options,
        },
    );
}

export async function prefetchVote(
    queryClient: QueryClient,
    contentType: VoteContentTypeEnum,
    slug: string,
    options: UseVoteOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.vote.get(contentType, slug),
        (client) => client.vote.getVote(contentType, slug),
        options,
    );
}
