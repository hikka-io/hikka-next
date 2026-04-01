import { HikkaClient } from '@hikka/client';
import {
    MutationCache,
    QueryClient,
    createHikkaClient,
    createQueryClient,
} from '@hikka/react/core';
import { sessionOptions, sessionUserUIOptions } from '@hikka/react/options';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { toast } from 'sonner';

import ErrorPage from '@/components/error-page';

import { routeTree } from './routeTree.gen';
import { getAuthTokenFn } from './utils/cookies';

export interface RouterContext {
    queryClient: QueryClient;
    hikkaClient: HikkaClient;
}

const isServer = typeof window === 'undefined';

export async function createRouter() {
    const queryClient = createQueryClient({
        mutationCache: new MutationCache({
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    });

    const authToken = await getAuthTokenFn();

    const hikkaClient = createHikkaClient({
        baseUrl: import.meta.env.API_URL ?? 'https://api.hikka.io',
        authToken: authToken ?? undefined,
    });

    const router = createTanStackRouter({
        routeTree,
        context: { queryClient, hikkaClient },
        defaultPreload: false,
        defaultErrorComponent: ErrorPage,
        scrollRestoration: true,
        defaultStaleTime: Infinity,
    });

    setupRouterSsrQueryIntegration({
        router,
        queryClient,
        wrapQueryClient: true,
    });

    if (isServer) {
        await Promise.all([
            queryClient.prefetchQuery(sessionOptions(hikkaClient)),
            queryClient.prefetchQuery(sessionUserUIOptions(hikkaClient)),
        ]);
    }

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
