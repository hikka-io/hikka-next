'use client';

import { VoteResponse } from '@hikka/client';

import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import { UseVoteMutationParams, UseVoteStatusParams } from '@/types/vote';

/**
 * Hook for getting vote status for content
 */
export function useContentVote({
    contentType,
    slug,
    ...rest
}: UseVoteStatusParams & QueryParams<VoteResponse>) {
    return useQuery({
        queryKey: queryKeys.vote.status(contentType, slug),
        queryFn: (client) => client.vote.getContentVote(contentType, slug),
        ...rest,
    });
}

/**
 * Hook for setting vote on content
 */
export const useCreateVote = createMutation({
    mutationFn: (client, args: UseVoteMutationParams) =>
        client.vote.createVote(args.contentType, args.slug, {
            score: args.score,
        }),
    invalidateQueries: (args) => [
        queryKeys.vote.status(args.contentType, args.slug),
    ],
});
