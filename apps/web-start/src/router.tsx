import { HikkaClient } from '@hikka/client';
import {
    createHikkaClient,
    createQueryClient,
    dehydrate,
    QueryClient,
} from '@hikka/react/core';
import { HikkaProvider } from '@hikka/react';
import { hydrate } from '@tanstack/query-core';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export interface RouterContext {
    queryClient: QueryClient;
    hikkaClient: HikkaClient;
}

export function createRouter() {
    const queryClient = createQueryClient();
    const hikkaClient = createHikkaClient({
        baseUrl: import.meta.env.VITE_API_URL ?? 'https://api.hikka.io',
    });

    return createTanStackRouter({
        routeTree,
        context: { queryClient, hikkaClient },
        defaultPreload: 'intent',
        scrollRestoration: true,
        dehydrate: () =>
            ({
                queryClientState: dehydrate(queryClient),
            }) as any,
        hydrate: ({ queryClientState }) => {
            hydrate(queryClient as any, queryClientState);
        },
        Wrap: ({ children }) => (
            <HikkaProvider client={hikkaClient} queryClient={queryClient}>
                {children}
            </HikkaProvider>
        ),
    });
}

export function getRouter() {
    return createRouter();
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}
