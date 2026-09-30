import { act, type FC } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEditQueryKey } from '@hikka/api';

import { Route } from '../../routes/_pages/edit/$editId';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const pageHeader = vi.hoisted(() => vi.fn());

vi.mock('@tanstack/react-router', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-router')>()),
    Outlet: () => null,
}));

vi.mock('@/features/app-shell', () => ({
    usePageHeader: pageHeader,
}));

vi.mock('@/features/edit', () => ({
    EditContent: ({ content }: { content: { title_ua: string } }) => (
        <p>{content.title_ua}</p>
    ),
    EditTimeline: () => null,
}));

vi.mock('@/services/session', () => ({
    useTitle: (item?: { title_ua?: string }) => item?.title_ua ?? '',
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    usePathname: () => '/edit/7',
}));

const EDIT_ID = 7;

const edit = (title: string) => ({
    edit_id: EDIT_ID,
    content_type: 'anime',
    content: { slug: 'frieren', title_ua: title },
});

function setup() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity, gcTime: Infinity } },
    });
    const queryKey = getEditQueryKey({ path: { edit_id: EDIT_ID } });
    const snapshot = edit('Old');

    queryClient.setQueryData(queryKey, snapshot as never);
    vi.spyOn(Route, 'useParams').mockReturnValue({
        editId: String(EDIT_ID),
    } as never);
    vi.spyOn(Route, 'useLoaderData').mockReturnValue({
        edit: snapshot,
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
    pageHeader.mockReset();
    vi.restoreAllMocks();
});

describe('edit layout', () => {
    it('server-renders the cached edit', () => {
        const { tree } = setup();

        expect(renderToString(tree)).toContain('Old');
        expect(pageHeader).toHaveBeenLastCalledWith(
            expect.objectContaining({
                title: `Правка #${EDIT_ID}`,
                subtitle: 'Old',
            }),
        );
    });

    it('re-renders when the cached edit changes', async () => {
        const { queryClient, queryKey, tree } = setup();
        const container = document.createElement('div');
        const root = createRoot(container);

        act(() => root.render(tree));
        expect(container.textContent).toBe('Old');

        await act(async () => {
            queryClient.setQueryData(queryKey, edit('New') as never);
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(container.textContent).toBe('New');
        expect(pageHeader).toHaveBeenLastCalledWith(
            expect.objectContaining({ subtitle: 'New' }),
        );
        act(() => root.unmount());
    });
});
