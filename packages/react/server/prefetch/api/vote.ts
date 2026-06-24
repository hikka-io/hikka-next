import type { UseVoteStatusParams } from '@/types/vote';
import { contentVoteOptions } from '@/options/api/vote';
import {
    type PrefetchQueryParams,
    prefetchQuery,
} from '@/server/prefetchQuery';

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
