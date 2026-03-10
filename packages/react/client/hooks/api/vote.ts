'use client';

import { VoteResponse } from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import { contentVoteOptions } from '@/options/api/vote';
import { UseVoteMutationParams, UseVoteStatusParams } from '@/types/vote';

/**
 * Hook for getting vote status for content
 */
export function useContentVote({
    contentType,
    slug,
    ...rest
}: UseVoteStatusParams & QueryParams<VoteResponse>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...contentVoteOptions(client, { contentType, slug }),
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
        queryKeys.articles.bySlug(args.slug),
        queryKeys.collections.byReference(args.slug),
        queryKeys.comments.all,
    ],
});
