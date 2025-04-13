import { QueryClient } from '@tanstack/query-core';
import { QueryClientConfig } from '@tanstack/react-query';
import { cache } from 'react';

export const createQueryClient = (config?: QueryClientConfig) =>
    new QueryClient({
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

const getQueryClient = cache(() => createQueryClient());

export default getQueryClient;
