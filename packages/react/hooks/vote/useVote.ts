import { VoteContentType, VoteResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseVoteStatusParams {
    contentType: VoteContentType;
    slug: string;
}

/**
 * Hook for getting vote status for content
 */
export function useVoteStatus({
    contentType,
    slug,
    ...rest
}: UseVoteStatusParams & QueryParams<VoteResponse>) {
    return useQuery({
        queryKey: queryKeys.vote.status(contentType, slug),
        queryFn: (client) => client.vote.getVote(contentType, slug),
        ...rest,
    });
}

/**
 * Hook for prefetching vote status
 */
export async function prefetchVoteStatus({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams<VoteResponse> & UseVoteStatusParams) {
    return prefetchQuery({
        queryKey: queryKeys.vote.status(contentType, slug),
        queryFn: (client) => client.vote.getVote(contentType, slug),
        ...rest,
    });
}
