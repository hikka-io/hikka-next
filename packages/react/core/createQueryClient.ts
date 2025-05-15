import { QueryClient } from '@tanstack/query-core';
import { QueryClientConfig } from '@tanstack/react-query';
import { cache } from 'react';

import { TitleLanguage } from '@/utils';

/**
 * Creates a QueryClient instance.
 * This ensures a clean QueryClient is created for each request.
 *
 * @param config - The QueryClient config
 * @returns A new QueryClient instance
 */
export function createQueryClient(
    config?: QueryClientConfig,
    defaultTitle?: TitleLanguage,
) {
    return new QueryClient({
        ...config,
        defaultOptions: {
            ...config?.defaultOptions,
            queries: {
                staleTime: 60 * 1000,
                gcTime: Infinity,
                retry: false,
                ...config?.defaultOptions?.queries,
            },
        },
    });
}

export const getQueryClient = cache(createQueryClient);
