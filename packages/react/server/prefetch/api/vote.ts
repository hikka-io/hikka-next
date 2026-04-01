import { contentVoteOptions } from '@/options/api/vote';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import { UseVoteStatusParams } from '@/types/vote';

/**
 * Hook for prefetching vote status
 */
export async function prefetchContentVote({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams & UseVoteStatusParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            contentVoteOptions(client, { contentType, slug }),
        ...rest,
    });
}
