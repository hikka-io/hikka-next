import { act } from 'react';
import { createRoot } from 'react-dom/client';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    type MainContentTypeEnum,
} from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';

import MediaTooltip from './media-tooltip';
import type { MediaTooltipItem } from './types';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

configureBrowserClient({ baseUrl: 'https://api.example.test' });

vi.mock('./hover-card-wrapper', () => ({
    default: ({ content }: { content: React.ReactNode }) => <>{content}</>,
}));

vi.mock('./media-tooltip-content', () => ({
    default: ({ title }: { title?: string }) => <p>{title}</p>,
}));

vi.mock('@/components/tracking', () => ({
    ReadListButton: () => null,
    TrackingButtonsGroup: () => null,
    WatchListButton: () => null,
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: undefined }),
    useTitle: (data?: { title_ua?: string }) => data?.title_ua,
}));

const SLUG = 'some-slug';

const TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
] as const;

const info = (type: MainContentTypeEnum, title_ua: string) => ({
    data_type: type,
    slug: SLUG,
    title_ua,
    score: 8,
    genres: [],
    media_type: null,
    status: null,
    volumes: null,
    chapters: null,
    episodes_total: null,
    episodes_released: null,
});

const teardown: (() => void)[] = [];

afterEach(() => {
    for (const dispose of teardown.splice(0)) act(() => dispose());
    vi.unstubAllGlobals();
});

async function render(
    queryClient: QueryClient,
    type: MainContentTypeEnum,
    item?: MediaTooltipItem,
) {
    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <MediaTooltip type={type} slug={SLUG} item={item}>
                    <span>trigger</span>
                </MediaTooltip>
            </QueryClientProvider>,
        ),
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    teardown.push(() => root.unmount());

    return container;
}

const newQueryClient = () =>
    new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });

const cachedHashes = (queryClient: QueryClient) =>
    queryClient
        .getQueryCache()
        .getAll()
        .map((query) => query.queryHash);

describe.each(TYPES)('MediaTooltip(%s)', (type) => {
    const key = contentInfoOptions(type, SLUG).queryKey;

    it('renders its own cached info through one observer', async () => {
        const queryClient = newQueryClient();
        queryClient.setQueryData(key, info(type, `cached ${type}`) as never);

        const container = await render(queryClient, type);

        expect(container.textContent).toBe(`cached ${type}`);
        expect(cachedHashes(queryClient)).toEqual([hashKey(key)]);
        expect(
            queryClient.getQueryCache().getAll()[0].getObserversCount(),
        ).toBe(1);
    });

    it('fetches only its own info while loading', async () => {
        const fetchSpy = vi.fn(() => new Promise<Response>(() => {}));
        vi.stubGlobal('fetch', fetchSpy);
        const queryClient = newQueryClient();

        await render(queryClient, type);

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(cachedHashes(queryClient)).toEqual([hashKey(key)]);
    });

    it('renders a passed item without fetching', async () => {
        const fetchSpy = vi.fn(() => new Promise<Response>(() => {}));
        vi.stubGlobal('fetch', fetchSpy);
        const queryClient = newQueryClient();

        const container = await render(
            queryClient,
            type,
            info(type, `item ${type}`) as unknown as MediaTooltipItem,
        );

        expect(container.textContent).toBe(`item ${type}`);
        expect(fetchSpy).not.toHaveBeenCalled();
        expect(cachedHashes(queryClient)).toEqual([hashKey(key)]);
    });
});
