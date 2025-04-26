'use client';

import { HikkaClient, HikkaClientConfig } from '@hikka/client';
import {
    QueryClient,
    QueryClientConfig,
    QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';

import { getHikkaClient, getQueryClient } from '@/core';

import { HikkaContext } from './context';

export interface HikkaProviderProps {
    children: ReactNode;
    clientConfig?: HikkaClientConfig;
    client?: HikkaClient;
    queryClient?: QueryClient;
    queryClientConfig?: QueryClientConfig;
}

/**
 * Provider component for Hikka React integration.
 * Initializes the TanStack Query client and provides the Hikka client context.
 */
export function HikkaProvider({
    children,
    client,
    clientConfig,
    queryClient,
    queryClientConfig,
}: HikkaProviderProps) {
    // Create a new QueryClient if one is not provided
    const qClient = useMemo(() => {
        if (queryClient) return queryClient;

        return getQueryClient(queryClientConfig);
    }, [queryClient, queryClientConfig]);

    // Create a new Hikka client if one is not provided
    const apiClient = useMemo(() => {
        if (client) return client;

        return getHikkaClient(clientConfig);
    }, [client, clientConfig]);

    return (
        <QueryClientProvider client={qClient}>
            <HikkaContext.Provider value={apiClient}>
                {children}
            </HikkaContext.Provider>
        </QueryClientProvider>
    );
}
