import { QueryClient } from '@tanstack/query-core';
import { QueryClientConfig } from '@tanstack/react-query';
import { cache } from 'react';

/**
 * Creates a QueryClient instance.
 * This ensures a clean QueryClient is created for each request.
 *
 * @param config - The QueryClient config
 * @returns A new QueryClient instance
 */
export function createQueryClient(config?: QueryClientConfig) {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                gcTime: Infinity,
                retry: false,
                ...config?.defaultOptions?.queries,
            },
            ...config?.defaultOptions,
        },
        ...config,
    });
}

export const getQueryClient = cache(createQueryClient);
