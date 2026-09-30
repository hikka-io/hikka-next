import { QueryClient } from '@tanstack/react-query';
import {
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
} from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';

import { animeSlugQueryKey } from '@hikka/api';

import { refreshEditedContent } from './use-refresh-edited-content';

const SLUG = 'mushishi';

function setup() {
    const server = { title: 'Old' };
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000, gcTime: Infinity } },
    });
    const rootRoute = createRootRoute();
    const animeRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: '/anime/$slug',
        loader: async ({ params }) => ({
            anime: await queryClient.ensureQueryData({
                queryKey: animeSlugQueryKey({ path: { slug: params.slug } }),
                queryFn: () => ({ ...server }),
            }),
        }),
    });
    const editRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: '/edit',
    });
    const router = createRouter({
        routeTree: rootRoute.addChildren([animeRoute, editRoute]),
        history: createMemoryHistory({ initialEntries: [`/anime/${SLUG}`] }),
        defaultStaleTime: Infinity,
    });

    const loadedTitle = () =>
        (
            router.state.matches.at(-1)?.loaderData as
                | { anime: { title: string } }
                | undefined
        )?.anime.title;

    return { server, queryClient, router, loadedTitle };
}

describe('refreshEditedContent', () => {
    it('reloads a cached detail match the router would otherwise reuse', async () => {
        const { server, router, loadedTitle } = setup();
        await router.load();
        await router.navigate({ to: '/edit' });

        server.title = 'New';
        await router.navigate({ to: '/anime/$slug', params: { slug: SLUG } });
        expect(loadedTitle()).toBe('Old');
    });

    it('refetches the content and reloads its cached detail match', async () => {
        const { server, queryClient, router, loadedTitle } = setup();
        await router.load();
        await router.navigate({ to: '/edit' });

        server.title = 'New';
        await refreshEditedContent(queryClient, router, SLUG);
        await router.navigate({ to: '/anime/$slug', params: { slug: SLUG } });

        expect(loadedTitle()).toBe('New');
    });

    it('reloads the detail match that is on screen', async () => {
        const { server, queryClient, router, loadedTitle } = setup();
        await router.load();

        server.title = 'New';
        await refreshEditedContent(queryClient, router, SLUG);

        expect(loadedTitle()).toBe('New');
    });

    it('leaves other slugs cached', async () => {
        const { server, queryClient, router, loadedTitle } = setup();
        await router.load();
        await router.navigate({ to: '/edit' });

        server.title = 'New';
        await refreshEditedContent(queryClient, router, 'other');
        await router.navigate({ to: '/anime/$slug', params: { slug: SLUG } });

        expect(loadedTitle()).toBe('Old');
    });
});
