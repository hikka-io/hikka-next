import { HikkaClient } from '@hikka/client';
import {
    createHikkaClient,
    createQueryClient,
    dehydrate,
    MutationCache,
    QueryClient,
} from '@hikka/react/core';
import { hydrate } from '@tanstack/query-core';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

import { routeTree } from './routeTree.gen';

export interface RouterContext {
    queryClient: QueryClient;
    hikkaClient: HikkaClient;
}

export function createRouter() {
    const queryClient = createQueryClient({
        mutationCache: new MutationCache({
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    });
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
