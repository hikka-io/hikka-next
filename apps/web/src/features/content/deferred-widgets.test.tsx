import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    getBrowserClient,
    getCollectionsInfiniteOptions,
} from '@hikka/api';

import ContentArticles from './articles/articles';
import ContentCollections from './collections';
import Followings from './followings/followings';
import FollowingsModal from './followings/followings-modal';
import Franchise from './franchise/franchise';
import {
    contentCollectionsOptions,
    contentFollowingOptions,
    contentRelatedFranchiseOptions,
} from './queries';
import ContentStaff from './staff';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const SLUG = 'some-slug';
const BASE_URL = 'https://api.example.test';

const mocks = vi.hoisted(() => ({
    user: { username: 'someone' } as { username: string } | undefined,
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: mocks.user }),
    useTitle: () => 'title',
}));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ slug: SLUG }),
    Link: () => null,
}));

vi.mock('@/services/hooks/use-close-on-route-change', () => ({
    useCloseOnRouteChange: () => {},
}));

vi.mock('@/services/hooks/use-media-query', () => ({
    useIsDesktop: () => true,
}));

vi.mock('@/services/ui-preferences-store', async (importOriginal) => ({
    ...(await importOriginal<
        typeof import('@/services/ui-preferences-store')
    >()),
    useUiPreferences: (select: (state: unknown) => unknown) =>
        select({ views: {}, filters: {} }),
}));

vi.mock('@/features/collections', () => ({
    CollectionListModal: () => null,
}));

vi.mock('@/components/ui/responsive-modal', () => ({
    ResponsiveModal: () => null,
    ResponsiveModalContent: () => null,
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

const PAGE = { total: 0, pages: 1, page: 1 };

const bodyFor = (pathname: string) =>
    pathname.endsWith('/franchise')
        ? { anime: [], manga: [], novel: [] }
        : { pagination: PAGE, list: [] };

const requests: URL[] = [];

const fetchMock = vi.fn(async (input: Request) => {
    const url = new URL(input.url);
    requests.push(url);

    return new Response(JSON.stringify(bodyFor(url.pathname)), {
        status: 200,
        headers: { 'content-type': 'application/json' },
    });
});

const scrollIntoView = async () => {
    await act(async () => {
        for (const observer of MockIntersectionObserver.instances) {
            observer.intersect();
        }
    });
};

const settle = () =>
    act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
    });

const pathsRequested = () => requests.map((url) => url.pathname);

let container: HTMLDivElement;
let root: Root;

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const render = async (node: React.ReactNode) => {
    await act(async () => {
        root.render(
            <QueryClientProvider client={queryClient}>
                {node}
            </QueryClientProvider>,
        );
    });
};

beforeEach(() => {
    queryClient.clear();
    requests.length = 0;
    fetchMock.mockClear();
    mocks.user = { username: 'someone' };
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

describe('deferred overview widgets', () => {
    it('requests nothing before the widgets are visible', async () => {
        await render(
            <>
                <ContentCollections content_type="anime" />
                <ContentArticles content_type={ContentTypeEnum.ANIME} />
                <Followings content_type={ContentTypeEnum.ANIME} />
                <Franchise content_type="anime" />
                <ContentStaff content_type={ContentTypeEnum.ANIME} />
            </>,
        );

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('renders a skeleton wrapper while a widget is waiting', async () => {
        await render(<ContentCollections content_type="anime" />);

        expect(container.querySelector('.animate-pulse')).not.toBeNull();
    });

    it('sizes the franchise skeleton like its two-item preview', async () => {
        await render(<Franchise content_type="anime" />);

        expect(container.querySelector('.grid-min-20')?.children).toHaveLength(
            2,
        );
    });

    it('sizes the staff skeleton like its five-person preview', async () => {
        await render(<ContentStaff content_type={ContentTypeEnum.ANIME} />);

        expect(container.querySelector('.grid-min-6')?.children).toHaveLength(
            5,
        );
    });

    it('requests the collections preview with a size of 3, once', async () => {
        await render(<ContentCollections content_type="anime" />);
        await scrollIntoView();

        expect(pathsRequested()).toEqual(['/collections']);
        expect(requests[0].searchParams.get('size')).toBe('3');
        expect(requests[0].searchParams.get('page')).toBe('1');
    });

    it('keys the collections preview as the modal key plus a size of 3', async () => {
        await render(<ContentCollections content_type="anime" />);
        await scrollIntoView();

        const previewKey = contentCollectionsOptions('anime', SLUG, {
            preview: true,
        }).queryKey;
        const modalKey = contentCollectionsOptions('anime', SLUG).queryKey;
        const cached = queryClient.getQueryCache().getAll();

        expect(cached.map((query) => query.queryKey)).toEqual([previewKey]);
        expect(previewKey[0]).toEqual({ ...modalKey[0], query: { size: 3 } });
        expect(previewKey).toEqual(
            getCollectionsInfiniteOptions({
                body: { content_type: 'anime', content: [SLUG] },
                query: { size: 3 },
            }).queryKey,
        );
    });

    it('requests the articles list once after it becomes visible', async () => {
        await render(<ContentArticles content_type={ContentTypeEnum.ANIME} />);
        await scrollIntoView();

        expect(pathsRequested()).toEqual(['/articles']);
    });

    it('requests the followings preview with a size of 3, once', async () => {
        await render(<Followings content_type={ContentTypeEnum.ANIME} />);
        await scrollIntoView();

        expect(pathsRequested()).toEqual([`/watch/${SLUG}/following`]);
        expect(requests[0].searchParams.get('size')).toBe('3');
    });

    const singleObserverOn = (queryKey: readonly unknown[]) => {
        const queries = queryClient.getQueryCache().getAll();

        expect(queries.map((query) => query.queryHash)).toEqual([
            hashKey(queryKey),
        ]);
        expect(queries[0].getObserversCount()).toBe(1);
    };

    it.each([
        ContentTypeEnum.ANIME,
        ContentTypeEnum.MANGA,
        ContentTypeEnum.NOVEL,
    ] as const)(
        'holds one followings preview observer for %s, before and after it is visible',
        async (type) => {
            await render(<Followings content_type={type} />);
            singleObserverOn(
                contentFollowingOptions(type, SLUG, { preview: true }).queryKey,
            );

            await scrollIntoView();
            singleObserverOn(
                contentFollowingOptions(type, SLUG, { preview: true }).queryKey,
            );
            expect(fetchMock).toHaveBeenCalledTimes(1);
        },
    );

    it.each([
        ContentTypeEnum.ANIME,
        ContentTypeEnum.MANGA,
        ContentTypeEnum.NOVEL,
    ] as const)('holds one followings modal observer for %s', async (type) => {
        await render(<FollowingsModal content_type={type} />);

        singleObserverOn(contentFollowingOptions(type, SLUG).queryKey);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('requests the read followings for manga', async () => {
        await render(<Followings content_type={ContentTypeEnum.MANGA} />);
        await scrollIntoView();

        expect(pathsRequested()).toEqual([`/read/manga/${SLUG}/following`]);
    });

    it('never requests followings for a logged-out visitor', async () => {
        mocks.user = undefined;
        await render(<Followings content_type={ContentTypeEnum.ANIME} />);
        await scrollIntoView();

        expect(fetchMock).not.toHaveBeenCalled();
        expect(container.querySelector('.animate-pulse')).toBeNull();
    });

    it('requests the franchise once after it becomes visible', async () => {
        await render(<Franchise content_type="anime" />);
        await scrollIntoView();

        expect(pathsRequested()).toEqual([`/related/anime/${SLUG}/franchise`]);
    });

    it('caches the franchise under the loader key', async () => {
        await render(<Franchise content_type="anime" />);
        await scrollIntoView();
        await settle();

        expect(
            queryClient
                .getQueryCache()
                .getAll()
                .map((query) => query.queryHash),
        ).toEqual([
            hashKey(contentRelatedFranchiseOptions('anime', SLUG).queryKey),
        ]);
    });

    it('requests the staff list once after it becomes visible', async () => {
        await render(<ContentStaff content_type={ContentTypeEnum.ANIME} />);
        await scrollIntoView();

        expect(pathsRequested()).toEqual([`/anime/${SLUG}/staff`]);
    });

    it('does not gate the extended franchise and staff pages', async () => {
        await render(
            <>
                <Franchise extended content_type="anime" />
                <ContentStaff extended content_type={ContentTypeEnum.ANIME} />
            </>,
        );

        expect(pathsRequested().sort()).toEqual([
            `/anime/${SLUG}/staff`,
            `/related/anime/${SLUG}/franchise`,
        ]);
    });

    it('collapses to nothing when the loaded list is empty', async () => {
        await render(<ContentCollections content_type="anime" />);
        await scrollIntoView();
        await settle();

        expect(container.innerHTML).toBe('');
    });
});
