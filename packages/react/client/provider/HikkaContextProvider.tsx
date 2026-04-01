'use client';

import { HikkaClient, HikkaClientConfig } from '@hikka/client';
import { ReactNode, useMemo } from 'react';

import { getHikkaClient } from '@/core';

import { DefaultOptions } from './HikkaProvider';
import { HikkaContext } from './context';

export interface HikkaContextProviderProps {
    children: ReactNode;
    clientConfig?: HikkaClientConfig;
    client?: HikkaClient;
    defaultOptions?: DefaultOptions;
}

/**
 * Lightweight provider that only provides HikkaContext (client + options).
 * Use this when QueryClientProvider is already provided externally
 * (e.g., via TanStack Router's setupRouterSsrQueryIntegration with wrapQueryClient: true).
 */
export function HikkaContextProvider({
    children,
    client,
    clientConfig,
    defaultOptions,
}: HikkaContextProviderProps) {
    const apiClient = useMemo(() => {
        if (client) return client;

        return getHikkaClient(clientConfig);
    }, [client, clientConfig]);

    const value = useMemo(
        () => ({
            defaultOptions,
            client: apiClient,
        }),
        [defaultOptions, apiClient],
    );

    return (
        <HikkaContext.Provider value={value}>{children}</HikkaContext.Provider>
    );
}
