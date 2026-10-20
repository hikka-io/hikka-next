import type { QueryClient } from '@tanstack/query-core';

import {
    type InvalidateOptions,
    invalidateByIds,
    patchQueries,
} from './content-cache';
import { patchEmbeddedVote } from './patch-embedded';
import { COMMENT_LIST_IDS } from './query-groups';
import type { QueryId } from './query-id';

/** Comment lists + content-list queries that embed a comments count/preview. */
const COMMENT_IDS: readonly QueryId[] = [
    ...COMMENT_LIST_IDS,
    'animeSlug',
    'mangaInfo',
    'novelInfo',
    'characterInfo',
    'personInfo',
    'getCollection',
    'getEdit',
    'getArticle',
];

const COMMENT_LIST_SET = new Set<string>(COMMENT_LIST_IDS);

/** Invalidate comment lists/threads after a comment write/edit/delete. */
export function invalidateComments(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, COMMENT_IDS, options);
}

/**
 * Put the viewer's `score` on every cached copy of the comment and stale-mark the
 * lists without refetching them, so a vote never reloads a thread. Also the rollback:
 * applying the previous score restores the previous total.
 */
export function applyCommentVote(
    queryClient: QueryClient,
    reference: string,
    score: number,
): Promise<void> {
    patchQueries(queryClient, COMMENT_LIST_SET, (cached) =>
        patchEmbeddedVote(cached, reference, score),
    );
    return invalidateByIds(queryClient, COMMENT_LIST_IDS, { refetch: false });
}
