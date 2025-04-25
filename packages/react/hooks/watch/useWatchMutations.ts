import { WatchArgs, WatchStatusEnum } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

type AddOrUpdateWatchVariables = {
    slug: string;
    args: WatchArgs;
};

/**
 * Hook for adding or updating a watch entry
 */
export const useAddOrUpdateWatch = createMutation({
    mutationFn: (client, { slug, args }: AddOrUpdateWatchVariables) =>
        client.watch.createWatch(slug, args),
    invalidateQueries: ({ slug }) => [
        queryKeys.watch.entry(slug),
        queryKeys.watch.all,
        queryKeys.anime.search({}),
    ],
});

/**
 * Hook for deleting a watch entry
 */
export const useDeleteWatch = createMutation({
    mutationFn: (client, slug: string) => client.watch.deleteWatch(slug),
    invalidateQueries: (slug) => [
        queryKeys.watch.entry(slug),
        queryKeys.watch.all,
    ],
});

/**
 * Variables for the random anime mutation
 */
export interface RandomAnimeVariables {
    username: string;
    status: WatchStatusEnum;
}

/**
 * Hook for getting a random anime from a user's watch list
 */
export const useRandomAnime = createMutation({
    mutationFn: (client, { username, status }: RandomAnimeVariables) =>
        client.watch.getRandomWatchByStatus(username, status),
    invalidateQueries: () => [],
});
