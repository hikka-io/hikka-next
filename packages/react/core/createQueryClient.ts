import { QueryClient } from '@tanstack/query-core';
import { QueryClientConfig } from '@tanstack/react-query';

export function createQueryClient(config?: QueryClientConfig) {
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

// Alias for backward compatibility — callers that used getQueryClient()
// must now manage the instance themselves (or use router context)
export const getQueryClient = createQueryClient;
