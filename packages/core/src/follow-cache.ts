import type { QueryClient } from '@tanstack/query-core';

import {
    type InvalidateOptions,
    invalidateByIds,
    patchQueries,
} from './content-cache';
import { type FollowChange, patchEmbeddedFollow } from './patch-embedded';
import {
    ARTICLE_IDS,
    COLLECTION_IDS,
    FOLLOW_EMBED_IDS,
    FOLLOW_IDS,
    USER_PROFILE_ID,
} from './query-groups';
import { matchesPath } from './query-id';

const FOLLOW_EMBED_SET = new Set<string>(FOLLOW_EMBED_IDS);

/**
 * Reflect a follow/unfollow: patch `is_followed` into the embedded authors and
 * the target's profile, refetch the follow lists/stats, the personalised feed
 * and the target's profile, and only stale-mark the article/collection lists
 * (they order by followed authors) so one click never reloads a large list.
 */
export function applyFollowChange(
    queryClient: QueryClient,
    change: FollowChange,
    options?: InvalidateOptions,
): Promise<void> {
    patchQueries(queryClient, FOLLOW_EMBED_SET, (data) =>
        patchEmbeddedFollow(data, change),
    );
    return Promise.all([
        invalidateByIds(queryClient, FOLLOW_IDS, options, (query) =>
            matchesPath(
                query.queryKey,
                USER_PROFILE_ID,
                'username',
                change.username,
            ),
        ),
        invalidateByIds(queryClient, [...ARTICLE_IDS, ...COLLECTION_IDS], {
            refetch: false,
        }),
    ]).then(() => undefined);
}
