import { FollowResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseUnfollowOptions
    extends Omit<
        UseMutationOptions<FollowResponse, Error, string>,
        'mutationFn'
    > {}

/**
 * Hook for unfollowing a user
 */
export function useUnfollow(
    params: UseUnfollowOptions = {},
): UseMutationResult<FollowResponse, Error, string> {
    return createMutation<FollowResponse, Error, string>(
        (client, username) => client.follow.unfollow(username),
        (username) => [
            // Invalidate follow status for this user
            queryKeys.follow.check(username),
            // Invalidate follow stats for this user
            queryKeys.follow.stats(username),
            // Invalidate follow stats for current user
            queryKeys.follow.stats(''),
            // Invalidate following list for current user
            queryKeys.follow.following(''),
            // Invalidate followers list for target user
            queryKeys.follow.followers(username),
        ],
    )(params);
}
