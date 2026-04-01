'use client';

import { useInfiniteQuery as useTanstackInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { feedOptions } from '@/options/api/feed';
import { UseFeedParams } from '@/types/feed';

/**
 * Hook for retrieving the feed with cursor-based infinite scrolling
 */
export function useFeed({
    args,
    options,
}: UseFeedParams & {
    options?: {
        enabled?: boolean;
        authProtected?: boolean;
    };
} = {}) {
    const { ref, inView } = useInView();
    const { client } = useHikkaClient();
    const opts = feedOptions(client, { args });

    const query = useTanstackInfiniteQuery({
        ...opts,
        ...options,
        enabled: options?.authProtected
            ? !!client.getAuthToken() && options?.enabled
            : options?.enabled,
    });

    const list = query.data?.pages.flat(1);

    React.useEffect(() => {
        if (inView) {
            query.fetchNextPage();
        }
    }, [inView]);

    return {
        ...query,
        list,
        ref,
    };
}
