import type { QueryClient } from '@tanstack/query-core';

import {
    getVoteQueryKey,
    type SetVoteData,
    VoteContentTypeEnum,
    type VoteResponse,
} from '@hikka/api';

import {
    type InvalidateOptions,
    invalidateByIds,
    patchQueries,
    refetchTypeFor,
} from './content-cache';
import { patchEmbeddedVote } from './patch-embedded';
import { matchesPath, type QueryId } from './query-id';

export const COMMENT_LIST_IDS: readonly QueryId[] = [
    'commentsList',
    'getCommentsList',
    'getCommentsUser',
    'thread',
    'latestComments',
];

const COMMENT_LIST_SET: ReadonlySet<string> = new Set(COMMENT_LIST_IDS);

const VOTE_DETAIL = {
    [VoteContentTypeEnum.ARTICLE]: ['getArticle', 'slug'],
    [VoteContentTypeEnum.COLLECTION]: ['getCollection', 'reference'],
} as const satisfies Record<
    Exclude<VoteContentTypeEnum, typeof VoteContentTypeEnum.COMMENT>,
    readonly [QueryId, string]
>;

function invalidateVote(
    queryClient: QueryClient,
    { content_type, slug }: SetVoteData['path'],
    options?: InvalidateOptions,
): Promise<void> {
    if (content_type === VoteContentTypeEnum.COMMENT) {
        return invalidateByIds(queryClient, COMMENT_LIST_IDS, {
            refetch: false,
        });
    }
    const [id, field] =
        VOTE_DETAIL[content_type as keyof typeof VOTE_DETAIL] ?? [];
    if (!id) return Promise.resolve();
    return queryClient.invalidateQueries({
        predicate: (query) => matchesPath(query.queryKey, id, field, slug),
        refetchType: refetchTypeFor(options),
    });
}

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
    if (target.content_type === VoteContentTypeEnum.COMMENT) {
        patchQueries(queryClient, COMMENT_LIST_SET, (cached) =>
            patchEmbeddedVote(cached, target.slug, data.score),
        );
    }
    return invalidateVote(queryClient, target, options);
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
