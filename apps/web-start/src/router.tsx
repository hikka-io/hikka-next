import { HikkaClient } from '@hikka/client';
import {
    createHikkaClient,
    createQueryClient,
    MutationCache,
    QueryClient,
} from '@hikka/react/core';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
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

    const router = createTanStackRouter({
        routeTree,
        context: { queryClient, hikkaClient },
        defaultPreload: 'intent',
        scrollRestoration: true,
    });

    setupRouterSsrQueryIntegration({
        router,
        queryClient,
        wrapQueryClient: true,
    });

    return router;
}

export function getRouter() {
    return createRouter();
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}
