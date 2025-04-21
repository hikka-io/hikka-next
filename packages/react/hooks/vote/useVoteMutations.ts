import { VoteContentTypeEnum } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

/**
 * Hook for setting vote on content
 */
export const useSetVote = createMutation({
    mutationFn: (
        client,
        args: {
            contentType: VoteContentTypeEnum;
            slug: string;
            score: number;
        },
    ) =>
        client.vote.setVote(args.contentType, args.slug, { score: args.score }),
    invalidateQueries: (args) => [
        queryKeys.vote.status(args.contentType, args.slug),
    ],
});
