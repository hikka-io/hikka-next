import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

/**
 * Hook for following a user
 */
export const useCreateFollow = createMutation({
    mutationFn: (client, username: string) =>
        client.follow.createFollow(username),
    invalidateQueries: (username: string) => [
        queryKeys.follow.status(username),
        queryKeys.follow.stats(username),
        queryKeys.user.byUsername(username),
    ],
});

/**
 * Hook for unfollowing a user
 */
export const useDeleteFollow = createMutation({
    mutationFn: (client, username: string) =>
        client.follow.deleteFollow(username),
    invalidateQueries: (username: string) => [
        queryKeys.follow.status(username),
        queryKeys.follow.stats(username),
        queryKeys.user.byUsername(username),
    ],
});
