import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { toast } from 'sonner';

import {
    type Client as ApiClient,
    configureBrowserClient,
    createRequestClient,
} from '@hikka/api';
import type { HikkaClient } from '@hikka/client';
import {
    createHikkaClient,
    createQueryClient,
    MutationCache,
    type QueryClient,
} from '@hikka/react/core';
import { sessionOptions, sessionUserUIOptions } from '@hikka/react/options';

import ErrorPage from '@/components/error-page';

import { routeTree } from './routeTree.gen';
import { getAuthTokenFn } from './utils/cookies';

export interface RouterContext {
    queryClient: QueryClient;
    hikkaClient: HikkaClient; // TODO(phase2): remove once all loaders use apiClient
    apiClient: ApiClient;
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

    const baseUrl = import.meta.env.API_URL ?? 'https://api.hikka.io';

    const hikkaClient = createHikkaClient({
        baseUrl,
        authToken: authToken ?? undefined,
    });

    // @hikka/api: per-request client for SSR loaders; configure the browser
    // singleton with baseUrl always (so loader/component query keys match) and
    // the token only in the browser (never the shared server singleton).
    const apiClient = createRequestClient({
        baseUrl,
        authToken: authToken ?? undefined,
    });
    configureBrowserClient({
        baseUrl,
        authToken: isServer ? undefined : (authToken ?? undefined),
    });

    const router = createTanStackRouter({
        routeTree,
        context: { queryClient, hikkaClient, apiClient },
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
