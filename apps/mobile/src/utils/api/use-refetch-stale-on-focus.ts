import { useCallback } from 'react';

import { type Query, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';

/**
 * Writes elsewhere only stale-mark the counters and feeds a screen shows, and a tab screen stays
 * mounted while hidden; refetch the stale ones when it comes back into view.
 */
export const useRefetchStaleOnFocus = (
    key: string,
    predicate: (query: Query) => boolean,
) => {
    const queryClient = useQueryClient();

    useFocusEffect(
        // biome-ignore lint/correctness/useExhaustiveDependencies: `key` identifies the predicate
        useCallback(() => {
            void queryClient.refetchQueries({
                predicate,
                stale: true,
                type: 'active',
            });
        }, [queryClient, key]),
    );
};
