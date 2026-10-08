import { act, type FC, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { configureBrowserClient } from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';

import { Route as ThreadRoute } from '../../routes/_pages/comments/$content_type/$slug/$';
import { Route as CommentsRoute } from '../../routes/_pages/comments/$content_type/$slug/index';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const pageHeader = vi.hoisted(() => vi.fn());

vi.mock('@/features/app-shell', () => ({ usePageHeader: pageHeader }));

vi.mock('@/features/content', () => ({
    ContentSubpage: ({ children }: { children: ReactNode }) => children,
    useContentTitle: (_type: string, content?: { title_ua?: string }) =>
        content?.title_ua ?? '',
}));

vi.mock('@/features/comments', () => ({
    CommentList: () => null,
    UserCommentList: () => null,
}));

vi.mock('@/features/filters', () => ({ useChangeParam: () => () => {} }));

const SLUG = 'frieren';

beforeAll(() => {
    configureBrowserClient({ baseUrl: 'https://api.example.test' });
});

afterEach(() => {
    pageHeader.mockReset();
    vi.restoreAllMocks();
});

const ROUTES = [
    ['comments page', CommentsRoute],
    ['thread page', ThreadRoute],
] as const;

describe.each(ROUTES)('%s', (_, route) => {
    it('titles the header from the cached content, not a loader snapshot', async () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { staleTime: Infinity, gcTime: Infinity },
            },
        });
        const { queryKey } = contentInfoOptions('anime', SLUG);
        queryClient.setQueryData(queryKey, { title_ua: 'Old' } as never);

        vi.spyOn(route, 'useParams').mockReturnValue({
            content_type: 'anime',
            slug: SLUG,
            _splat: 'reference',
        } as never);
        vi.spyOn(route, 'useSearch').mockReturnValue({} as never);
        vi.spyOn(route, 'useNavigate').mockReturnValue((() => {}) as never);
        const loaderData = vi.spyOn(route, 'useLoaderData');

        const Page = route.options.component as FC;
        const container = document.createElement('div');
        const root = createRoot(container);

        act(() =>
            root.render(
                <QueryClientProvider client={queryClient}>
                    <Page />
                </QueryClientProvider>,
            ),
        );
        expect(pageHeader).toHaveBeenLastCalledWith(
            expect.objectContaining({ title: 'Old' }),
        );

        await act(async () => {
            queryClient.setQueryData(queryKey, { title_ua: 'New' } as never);
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(pageHeader).toHaveBeenLastCalledWith(
            expect.objectContaining({ title: 'New' }),
        );
        expect(loaderData).not.toHaveBeenCalled();
        act(() => root.unmount());
    });
});
