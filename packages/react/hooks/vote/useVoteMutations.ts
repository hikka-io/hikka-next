import { VoteContentType } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

/**
 * Hook for setting vote on content
 */
export const useCreateVote = createMutation({
    mutationFn: (
        client,
        args: {
            contentType: VoteContentType;
            slug: string;
            score: number;
        },
    ) =>
        client.vote.createVote(args.contentType, args.slug, {
            score: args.score,
        }),
    invalidateQueries: (args) => [
        queryKeys.vote.status(args.contentType, args.slug),
    ],
});
