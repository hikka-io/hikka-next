import { act, type FC } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { userProfileQueryKey } from '@hikka/api';

import { Route } from '../../routes/_pages/u/$username';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@tanstack/react-router', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-router')>()),
    Outlet: () => null,
}));

vi.mock('@/features/app-shell', () => ({
    CoverImage: ({ cover }: { cover?: string }) => <p>{cover ?? 'none'}</p>,
    usePageHeader: () => undefined,
}));

vi.mock('@/features/users', () => ({
    ActivationAlert: () => null,
    FollowStats: () => null,
    USER_NAV_ROUTES: [],
    UserAvatar: () => null,
    UserListHeaderFilters: () => null,
    UserTitle: () => null,
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    usePathname: () => '/u/testuser',
}));

const USERNAME = 'testuser';

function setup() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity, gcTime: Infinity } },
    });
    const queryKey = userProfileQueryKey({ path: { username: USERNAME } });
    const snapshot = { username: USERNAME, cover: 'old.jpg' };

    queryClient.setQueryData(queryKey, snapshot as never);
    vi.spyOn(Route, 'useParams').mockReturnValue({
        username: USERNAME,
    } as never);
    vi.spyOn(Route, 'useLoaderData').mockReturnValue({
        user: snapshot,
    } as never);

    const Layout = Route.options.component as FC;
    const tree = (
        <QueryClientProvider client={queryClient}>
            <Layout />
        </QueryClientProvider>
    );

    return { queryClient, queryKey, tree };
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('user layout', () => {
    it('server-renders the cached cover', () => {
        const { tree } = setup();

        expect(renderToString(tree)).toContain('old.jpg');
    });

    it('re-renders when the cached profile changes', async () => {
        const { queryClient, queryKey, tree } = setup();
        const container = document.createElement('div');
        const root = createRoot(container);

        act(() => root.render(tree));
        expect(container.textContent).toBe('old.jpg');

        await act(async () => {
            queryClient.setQueryData(queryKey, {
                username: USERNAME,
                cover: null,
            } as never);
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(container.textContent).toBe('none');
        act(() => root.unmount());
    });
});
