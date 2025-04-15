import { HikkaClient } from '@hikka/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';

import { HikkaContext } from './context';

export interface HikkaProviderProps {
    children: ReactNode;
    client: HikkaClient;
    queryClient?: QueryClient;
    /** Default stale time for queries (in ms) - defaults to 5 minutes */
    defaultStaleTime?: number;
    /** Default cache time for queries (in ms) - defaults to 10 minutes */
    defaultCacheTime?: number;
}

/**
 * Provider component for Hikka React integration.
 * Initializes the TanStack Query client and provides the Hikka client context.
 */
export function HikkaProvider({
    children,
    client,
    queryClient,
    defaultStaleTime = 5 * 60 * 1000, // 5 minutes
    defaultCacheTime = 10 * 60 * 1000, // 10 minutes
}: HikkaProviderProps) {
    // Create a new QueryClient if one is not provided
    const qClient = useMemo(() => {
        if (queryClient) return queryClient;

        return new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: defaultStaleTime,
                    gcTime: defaultCacheTime,
                    refetchOnWindowFocus: false,
                    retry: 1,
                },
            },
        });
    }, [queryClient, defaultStaleTime, defaultCacheTime]);

    // Create the context value with the Hikka client
    const contextValue = useMemo(
        () => ({
            client,
        }),
        [client],
    );

    return (
        <QueryClientProvider client={qClient}>
            <HikkaContext.Provider value={contextValue}>
                {children}
            </HikkaContext.Provider>
        </QueryClientProvider>
    );
}
