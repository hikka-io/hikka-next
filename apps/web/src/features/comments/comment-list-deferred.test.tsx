import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { configureBrowserClient, getBrowserClient } from '@hikka/api';

import CommentList from './comment-list';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const SLUG = 'some-slug';

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: { username: 'someone' } }),
}));

vi.mock('@/utils/navigation', () => ({
    Link: () => null,
    useRouteSearch: () => ({}),
}));

vi.mock('@/features/auth', () => ({ LoginButton: () => null }));
vi.mock('@/features/filters', () => ({ Sort: () => null }));
vi.mock('./comment-input', () => ({ default: () => null }));
vi.mock('./comment-tree', () => ({ default: () => null }));
vi.mock('./comments-provider', () => ({
    default: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('./use-comment-sort', () => ({
    useCommentSort: () => ({
        sort: 'created',
        order: 'desc',
        setSort: () => {},
        setOrder: () => {},
    }),
}));
vi.mock('./review/use-review-stats', () => ({
    useReviewStats: () => ({ stats: undefined, commentsCount: undefined }),
}));

class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];

    private targets = new Set<Element>();

    constructor(private callback: IntersectionObserverCallback) {
        MockIntersectionObserver.instances.push(this);
    }

    observe(target: Element) {
        this.targets.add(target);
    }

    unobserve(target: Element) {
        this.targets.delete(target);
    }

    disconnect() {}

    intersect() {
        this.callback(
            [...this.targets].map(
                (target) =>
                    ({
                        target,
                        isIntersecting: true,
                        intersectionRatio: 1,
                    }) as IntersectionObserverEntry,
            ),
            this as unknown as IntersectionObserver,
        );
    }
}

const requests: URL[] = [];

const fetchMock = vi.fn(async (input: Request) => {
    requests.push(new URL(input.url));

    return new Response(
        JSON.stringify({
            pagination: { total: 0, pages: 1, page: 1 },
            list: [],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
    );
});

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

let container: HTMLDivElement;
let root: Root;

const render = (preview: boolean) =>
    act(async () => {
        root.render(
            <QueryClientProvider client={queryClient}>
                <CommentList
                    preview={preview}
                    slug={SLUG}
                    content_type="anime"
                />
            </QueryClientProvider>,
        );
    });

const scrollIntoView = () =>
    act(async () => {
        for (const observer of MockIntersectionObserver.instances) {
            observer.intersect();
        }
    });

const settle = () =>
    act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
    });

const EMPTY_STATE_TEXT = 'Коментарів не знайдено';

beforeEach(() => {
    queryClient.clear();
    requests.length = 0;
    fetchMock.mockClear();
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    configureBrowserClient({ baseUrl: 'https://api.example.test' });
    getBrowserClient().setConfig({ fetch: fetchMock as typeof fetch });
    container = document.createElement('div');
    root = createRoot(container);
});

afterEach(async () => {
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
});

describe('CommentList preview', () => {
    it('requests nothing and shows a skeleton before it is visible', async () => {
        await render(true);

        expect(fetchMock).not.toHaveBeenCalled();
        expect(container.querySelector('.animate-pulse')).not.toBeNull();
        expect(container.textContent).not.toContain(EMPTY_STATE_TEXT);
    });

    it('requests the list once, with a size of 3, after it is visible', async () => {
        await render(true);
        await scrollIntoView();

        expect(requests.map((url) => url.pathname)).toEqual([
            `/comments/anime/${SLUG}/list`,
        ]);
        expect(requests[0].searchParams.get('size')).toBe('3');
    });

    it('shows the empty state once the loaded list is empty', async () => {
        await render(true);
        await scrollIntoView();
        await settle();

        expect(container.textContent).toContain(EMPTY_STATE_TEXT);
    });

    it('does not gate the full list', async () => {
        await render(false);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
