import { MutationCache, QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { toast } from 'sonner';

import {
    type Client as ApiClient,
    configureBrowserClient,
    createRequestClient,
    getBrowserClient,
    profileOptions,
    profileUiOptions,
} from '@hikka/api';

import ErrorPage from '@/components/error-page';

import { routeTree } from './routeTree.gen';
import { getAuthTokenFn } from './utils/cookies';

export interface RouterContext {
    queryClient: QueryClient;
    apiClient: ApiClient;
}

const isServer = typeof window === 'undefined';

export async function createRouter() {
    const queryClient = new QueryClient({
        mutationCache: new MutationCache({
            onError: (error) => {
                toast.error(error.message);
            },
        }),
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                gcTime: Infinity,
                retry: false,
            },
        },
    });

    const authToken = await getAuthTokenFn();

    const baseUrl = import.meta.env.API_URL ?? 'https://api.hikka.io';

    // @hikka/api: configure the browser singleton with baseUrl always (so
    // loader/component query keys match) and the token only in the browser
    // (never the shared server singleton).
    configureBrowserClient({
        baseUrl,
        authToken: isServer ? undefined : (authToken ?? undefined),
    });

    // On the server, every request gets an isolated client carrying its own
    // token (no cross-request bleed). In the browser, the router context uses
    // the singleton so loaders pick up the live token after login/logout —
    // `createRouter` only runs once, so a frozen per-request token would go
    // stale the moment the user authenticates without a full reload.
    const apiClient = isServer
        ? createRequestClient({ baseUrl, authToken: authToken ?? undefined })
        : getBrowserClient();

    const router = createTanStackRouter({
        routeTree,
        context: { queryClient, apiClient },
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

    if (isServer && authToken) {
        await Promise.all([
            queryClient.prefetchQuery(profileOptions({ client: apiClient })),
            queryClient.prefetchQuery(profileUiOptions({ client: apiClient })),
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
