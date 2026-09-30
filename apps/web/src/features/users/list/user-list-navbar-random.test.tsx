import { act } from 'react';
import { createRoot } from 'react-dom/client';

import {
    MutationCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import UserListNavbar from './user-list-navbar';

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    randomWatchEntry: vi.fn(),
    randomReadNovel: vi.fn(),
}));

vi.mock('@hikka/api', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@hikka/api')>();
    const { queryOptions } = await import('@tanstack/react-query');
    return {
        ...actual,
        randomWatchEntry: mocks.randomWatchEntry,
        randomReadNovel: mocks.randomReadNovel,
        userWatchStatsOptions: () =>
            queryOptions({ queryKey: ['watch-stats'], queryFn: () => null }),
        userReadStatsOptions: () =>
            queryOptions({ queryKey: ['read-stats'], queryFn: () => null }),
    };
});

vi.mock('@tanstack/react-router', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-router')>()),
    useRouter: () => ({ navigate: mocks.navigate }),
}));

vi.mock('@/features/catalog', () => ({ ViewToggle: () => null }));

vi.mock('@/features/filters', () => ({
    FiltersButton: () => null,
    FiltersSidebarToggle: () => null,
    Sort: () => null,
    useChangeParam: () => vi.fn(),
}));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ username: 'someone' }),
    useRouteSearch: () => ({ status: 'planned' }),
}));

vi.mock('./user-list-filters-modal', () => ({ default: () => null }));

describe('UserListNavbar random button', () => {
    const onMutationError = vi.fn();

    beforeEach(() => {
        vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
        vi.stubGlobal('matchMedia', () => ({
            matches: false,
            addEventListener: () => {},
            removeEventListener: () => {},
        }));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
        document.body.innerHTML = '';
    });

    const mount = async (contentType: MainContentTypeEnum) => {
        const container = document.createElement('div');
        document.body.append(container);
        const root = createRoot(container);
        const queryClient = new QueryClient({
            mutationCache: new MutationCache({ onError: onMutationError }),
        });

        await act(async () => {
            root.render(
                <QueryClientProvider client={queryClient}>
                    <UserListNavbar content_type={contentType} />
                </QueryClientProvider>,
            );
        });

        const button = container.querySelector<HTMLButtonElement>(
            'button[aria-label^="Випадков"]',
        );

        return { root, button };
    };

    it('navigates to a random watch entry', async () => {
        mocks.randomWatchEntry.mockResolvedValue({ data: { slug: 'lain' } });
        const { root, button } = await mount(ContentTypeEnum.ANIME);

        await act(async () => {
            button?.click();
        });

        expect(mocks.randomWatchEntry).toHaveBeenCalledWith(
            expect.objectContaining({
                path: { username: 'someone', status: 'planned' },
                throwOnError: true,
            }),
        );
        expect(mocks.navigate).toHaveBeenCalledWith({ to: '/anime/lain' });

        await act(async () => root.unmount());
    });

    it('navigates to a random read entry', async () => {
        mocks.randomReadNovel.mockResolvedValue({ data: { slug: 'ln' } });
        const { root, button } = await mount(ContentTypeEnum.NOVEL);

        await act(async () => {
            button?.click();
        });

        expect(mocks.randomReadNovel).toHaveBeenCalledWith(
            expect.objectContaining({
                path: {
                    username: 'someone',
                    content_type: 'novel',
                    status: 'planned',
                },
                throwOnError: true,
            }),
        );
        expect(mocks.navigate).toHaveBeenCalledWith({ to: '/novel/ln' });

        await act(async () => root.unmount());
    });

    it('reports a failed request through the mutation cache without an unhandled rejection', async () => {
        const error = new Error('not found');
        mocks.randomWatchEntry.mockRejectedValue(error);
        const { root, button } = await mount(ContentTypeEnum.ANIME);

        await act(async () => {
            button?.click();
        });

        expect(onMutationError).toHaveBeenCalledTimes(1);
        expect(onMutationError.mock.calls[0]?.[0]).toBe(error);
        expect(mocks.navigate).not.toHaveBeenCalled();

        await act(async () => root.unmount());
    });
});
