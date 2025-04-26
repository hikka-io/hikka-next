import { VoteResponse } from '@hikka/client';

import { queryKeys } from '@/core';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import { UseVoteStatusParams } from '@/types/vote';

/**
 * Hook for prefetching vote status
 */
export async function prefetchContentVote({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams<VoteResponse> & UseVoteStatusParams) {
    return prefetchQuery({
        queryKey: queryKeys.vote.status(contentType, slug),
        queryFn: (client) => client.vote.getContentVote(contentType, slug),
        ...rest,
    });
}
