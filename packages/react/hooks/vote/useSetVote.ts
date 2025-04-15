import { VoteArgs, VoteContentTypeEnum, VoteResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type SetVoteVariables = {
    contentType: VoteContentTypeEnum;
    slug: string;
    args: VoteArgs;
};

/**
 * Hook for setting a vote for content
 */
export function useSetVote(
    options?: Omit<
        UseMutationOptions<VoteResponse, Error, SetVoteVariables>,
        'mutationFn'
    >,
): UseMutationResult<VoteResponse, Error, SetVoteVariables> {
    return createMutation<VoteResponse, Error, SetVoteVariables>(
        (client, { contentType, slug, args }) =>
            client.vote.setVote(contentType, slug, args),
        (variables) => [
            // Invalidate the vote status for this content
            queryKeys.vote.get(variables.contentType, variables.slug),
        ],
    )(options);
}
