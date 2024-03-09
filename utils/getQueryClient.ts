import { cache } from 'react';

import { QueryClient } from '@tanstack/query-core';

export const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                gcTime: Infinity,
                retry: false,
            },
        },
    });

const getQueryClient = cache(() => createQueryClient());

export default getQueryClient;
