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
import { shouldSkipGlobalErrorToast } from '@/utils/api/mutation-meta';

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
            onError: (error, _variables, _context, mutation) => {
                if (shouldSkipGlobalErrorToast(mutation.meta)) return;
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

    // `API_URL` is server-only; the browser bundle sees only `VITE_`-prefixed vars.
    const baseUrl =
        import.meta.env.API_URL ??
        import.meta.env.VITE_API_URL ??
        'https://api.hikka.io';

    // Token only in the browser; never on the shared server singleton.
    configureBrowserClient({
        baseUrl,
        authToken: isServer ? undefined : (authToken ?? undefined),
    });

    // Server: per-request client to avoid cross-request token bleed. Browser:
    // the singleton, so loaders pick up the live token after login/logout.
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
