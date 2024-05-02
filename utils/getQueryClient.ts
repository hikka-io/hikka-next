import { cache } from 'react';

import { QueryClient } from '@tanstack/query-core';
import { QueryClientConfig } from '@tanstack/react-query';

import { getCookie } from '@/utils/cookies';

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

const getQueryClient = cache(async () =>
    createQueryClient({
        defaultOptions: {
            queries: {
                meta: {
                    auth: await getCookie('auth'),
                },
            },
        },
    }),
);

export default getQueryClient;
