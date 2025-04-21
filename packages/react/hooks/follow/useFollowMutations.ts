import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

/**
 * Hook for following a user
 */
export const useFollow = createMutation({
    mutationFn: (client, username: string) => client.follow.follow(username),
    invalidateQueries: (username: string) => [
        queryKeys.follow.status(username),
        queryKeys.follow.stats(username),
        queryKeys.user.byUsername(username),
    ],
});

/**
 * Hook for unfollowing a user
 */
export const useUnfollow = createMutation({
    mutationFn: (client, username: string) => client.follow.unfollow(username),
    invalidateQueries: (username: string) => [
        queryKeys.follow.status(username),
        queryKeys.follow.stats(username),
        queryKeys.user.byUsername(username),
    ],
});
