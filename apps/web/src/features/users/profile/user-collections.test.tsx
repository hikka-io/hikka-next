import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { configureBrowserClient, getBrowserClient } from '@hikka/api';

import { userCollectionsPreviewOptions } from '../queries';
import UserCollections from './user-collections';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const USERNAME = 'someone';
const BASE_URL = 'https://api.example.test';

const mocks = vi.hoisted(() => ({
    user: undefined as { username: string } | undefined,
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: mocks.user }),
}));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ username: USERNAME }),
    Link: () => null,
}));

vi.mock('@/services/hooks/use-close-on-route-change', () => ({
    useCloseOnRouteChange: () => {},
}));

vi.mock('@/features/collections', () => ({
    CollectionListModal: () => null,
}));

vi.mock('@/components/ui/responsive-modal', () => ({
    ResponsiveModal: () => null,
    ResponsiveModalContent: () => null,
}));

vi.mock('@/components/list-items', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/components/list-items')>()),
    CollectionItem: ({ data }: { data: { reference: string } }) => (
        <div data-collection={data.reference} />
    ),
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

const PAGE = { total: 1, pages: 1, page: 1 };

const requests: URL[] = [];

const fetchMock = vi.fn(async (input: Request) => {
    requests.push(new URL(input.url));

    return new Response(JSON.stringify({ pagination: PAGE, list: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
    });
});

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const seedCache = (list: { reference: string }[]) => {
    queryClient.setQueryData(userCollectionsPreviewOptions(USERNAME).queryKey, {
        pages: [{ pagination: PAGE, list }],
        pageParams: [1],
    } as never);
};

const scrollIntoView = async () => {
    await act(async () => {
        for (const observer of MockIntersectionObserver.instances) {
            observer.intersect();
        }
    });
};

let container: HTMLDivElement;
let root: Root;

const render = async () => {
    await act(async () => {
        root.render(
            <QueryClientProvider client={queryClient}>
                <UserCollections />
            </QueryClientProvider>,
        );
    });
};

beforeEach(() => {
    queryClient.clear();
    requests.length = 0;
    fetchMock.mockClear();
    mocks.user = undefined;
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    configureBrowserClient({ baseUrl: BASE_URL });
    getBrowserClient().setConfig({ fetch: fetchMock as typeof fetch });
    container = document.createElement('div');
    root = createRoot(container);
});

afterEach(async () => {
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
});

describe('UserCollections', () => {
    it('requests the preview once it becomes visible', async () => {
        await render();

        expect(fetchMock).not.toHaveBeenCalled();

        await scrollIntoView();

        expect(requests.map((url) => url.pathname)).toEqual(['/collections']);
        expect(requests[0].searchParams.get('size')).toBe('3');
    });

    it('shows cached collections and refetches them once visible', async () => {
        seedCache([{ reference: 'cached' }]);
        await render();

        expect(container.querySelector('[data-collection="cached"]')).not.toBe(
            null,
        );
        expect(fetchMock).not.toHaveBeenCalled();

        await scrollIntoView();

        expect(requests.map((url) => url.pathname)).toEqual(['/collections']);
    });

    it('refetches a cached empty list of another user once visible', async () => {
        seedCache([]);
        await render();

        expect(container.textContent).toBe('');

        await scrollIntoView();

        expect(requests.map((url) => url.pathname)).toEqual(['/collections']);
    });
});
