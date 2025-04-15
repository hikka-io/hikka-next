import { WatchArgs, WatchResponse } from '@hikka/client';
import { UseMutationOptions } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseUpdateWatchOptions
    extends Omit<
        UseMutationOptions<
            WatchResponse,
            Error,
            { slug: string; args: WatchArgs }
        >,
        'mutationFn'
    > {}

/**
 * Hook for updating a watch entry
 */
export function useUpdateWatch(options: UseUpdateWatchOptions = {}) {
    return createMutation<
        WatchResponse,
        Error,
        { slug: string; args: WatchArgs }
    >(
        (client, { slug, args }) => client.watch.addOrUpdate(slug, args),
        // Invalidate relevant queries after a successful update
        ({ slug }) => [
            queryKeys.watch.get(slug),
            queryKeys.user.me(),
            // We don't know the username here, so invalidate all watch lists
            queryKeys.watch.all,
        ],
    )(options);
}
