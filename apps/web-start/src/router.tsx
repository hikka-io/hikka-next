import { HikkaClient } from '@hikka/client';
import {
    MutationCache,
    QueryClient,
    createHikkaClient,
    createQueryClient,
} from '@hikka/react/core';
import { sessionOptions } from '@hikka/react/options';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { toast } from 'sonner';

import { routeTree } from './routeTree.gen';
import { getAuthTokenFn } from './utils/cookies';

export interface RouterContext {
    queryClient: QueryClient;
    hikkaClient: HikkaClient;
}

export async function createRouter() {
    const queryClient = createQueryClient({
        mutationCache: new MutationCache({
            onError: (error) => {
                toast.error(error.message);
            },
        }),
        /*  queryCache: new QueryCache({
            onSuccess: (data, query) => {
                if (typeof window === 'undefined') {
                    console.log('[SSR Query]', query.queryKey);
                }
            },
        }), */
    });
    const authToken = await getAuthTokenFn();
    const hikkaClient = createHikkaClient({
        baseUrl: process.env.API_URL ?? 'https://api.hikka.io',
        authToken: authToken ?? undefined,
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

    await queryClient.prefetchQuery(sessionOptions(hikkaClient));

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
