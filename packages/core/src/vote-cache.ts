import type { QueryClient } from '@tanstack/query-core';

import {
    getVoteQueryKey,
    type SetVoteData,
    VoteContentTypeEnum,
    type VoteResponse,
} from '@hikka/api';

import { applyCommentVote } from './comment-cache';
import { type InvalidateOptions, refetchTypeFor } from './content-cache';
import { matchesPath, type QueryId } from './query-id';

const VOTE_DETAIL = {
    [VoteContentTypeEnum.ARTICLE]: ['getArticle', 'slug'],
    [VoteContentTypeEnum.COLLECTION]: ['getCollection', 'reference'],
} as const satisfies Record<
    Exclude<VoteContentTypeEnum, typeof VoteContentTypeEnum.COMMENT>,
    readonly [QueryId, string]
>;

/**
 * Store a vote and refresh what embeds it. The vote button is optimistic, so a
 * comment vote patches the comment lists and only stale-marks them; an
 * article/collection vote refetches that one detail.
 */
export function applyVoteMutation(
    queryClient: QueryClient,
    target: SetVoteData['path'],
    data: VoteResponse,
    options?: InvalidateOptions,
): Promise<void> {
    queryClient.setQueryData(getVoteQueryKey({ path: target }), data);
    const { content_type, slug } = target;
    if (content_type === VoteContentTypeEnum.COMMENT) {
        return applyCommentVote(queryClient, slug, data.score);
    }
    const [id, field] =
        VOTE_DETAIL[content_type as keyof typeof VOTE_DETAIL] ?? [];
    if (!id) return Promise.resolve();
    return queryClient.invalidateQueries({
        predicate: (query) => matchesPath(query.queryKey, id, field, slug),
        refetchType: refetchTypeFor(options),
    });
}

/** The scores a vote button shows while the viewer's vote (`pendingScore`) is on its way. */
export function optimisticVote(
    myScore: number,
    voteScore: number,
    pendingScore: number | undefined,
): { myScore: number; voteScore: number } {
    const current = pendingScore ?? myScore;
    return { myScore: current, voteScore: voteScore + (current - myScore) };
}

/** Tapping the active direction clears the vote. */
export const nextVoteScore = (current: number, pressed: -1 | 1) =>
    current === pressed ? 0 : pressed;
