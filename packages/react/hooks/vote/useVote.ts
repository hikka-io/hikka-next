import { VoteContentTypeEnum, VoteResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
    > {
    contentType: VoteContentTypeEnum;
    slug: string;
}

/**
 * Hook for getting vote status for content
 */
export function useVote(params: UseVoteOptions) {
    const { contentType, slug, ...options } = params;

    return useQuery(
        queryKeys.vote.get(contentType, slug),
        (client) => client.vote.getVote(contentType, slug),
        {
            enabled: !!contentType && !!slug,
            ...options,
        },
    );
}

export interface PrefetchVoteParams extends UseVoteOptions {
    queryClient: QueryClient;
}

export async function prefetchVote(params: PrefetchVoteParams) {
    const { queryClient, contentType, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.vote.get(contentType, slug),
        (client) => client.vote.getVote(contentType, slug),
        options,
    );
}
