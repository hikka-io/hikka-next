import { act } from 'react';
import { createRoot } from 'react-dom/client';

import {
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
    RouterProvider,
} from '@tanstack/react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePreventUnsavedClose } from './use-prevent-unsaved-close';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const modal = vi.hoisted(() => ({ open: false }));

vi.mock('./use-back-close', () => ({
    hasOpenBackCloseModal: () => modal.open,
}));

function Editor() {
    usePreventUnsavedClose(true, { navigation: true });
    return null;
}

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    modal.open = false;
});

async function mount() {
    const rootRoute = createRootRoute({ component: Outlet });
    const router = createRouter({
        routeTree: rootRoute.addChildren([
            createRoute({ getParentRoute: () => rootRoute, path: '/' }),
            createRoute({
                getParentRoute: () => rootRoute,
                path: '/articles/new',
                component: Editor,
            }),
            createRoute({ getParentRoute: () => rootRoute, path: '/anime' }),
        ]),
        history: createMemoryHistory({
            initialEntries: ['/', '/articles/new'],
        }),
    });

    const root = createRoot(document.createElement('div'));
    await act(async () => root.render(<RouterProvider router={router} />));
    teardown.push(() => root.unmount());

    const settle = () => act(async () => new Promise((r) => setTimeout(r, 0)));
    const path = () => router.state.location.pathname;

    return { router, settle, path };
}

describe('usePreventUnsavedClose', () => {
    it('holds in-app navigation while there are unsaved changes', async () => {
        const { router, settle, path } = await mount();

        await act(async () => {
            router.navigate({ to: '/anime' });
        });
        await settle();

        expect(path()).toBe('/articles/new');
    });

    it('still holds a link opened from a drawer', async () => {
        modal.open = true;
        const { router, settle, path } = await mount();

        await act(async () => {
            router.navigate({ to: '/anime' });
        });
        await settle();

        expect(path()).toBe('/articles/new');
    });

    it('lets a back press through to an open drawer', async () => {
        modal.open = true;
        const { router, settle, path } = await mount();

        await act(async () => router.history.back());
        await settle();

        expect(path()).toBe('/');
    });
});
