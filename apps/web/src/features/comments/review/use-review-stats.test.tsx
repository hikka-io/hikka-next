import { act } from 'react';
import { createRoot } from 'react-dom/client';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    CommentContentTypeEnum,
    ContentTypeEnum,
    configureBrowserClient,
} from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';

import { useReviewStats } from './use-review-stats';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

configureBrowserClient({ baseUrl: 'https://api.example.test' });

const SLUG = '42';

const REVIEW_TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
] as const;

const OTHER_TYPES = Object.values(CommentContentTypeEnum).filter(
    (type) => !(REVIEW_TYPES as readonly string[]).includes(type),
);

const REVIEW_STATS = { recommended: 3, not_recommended: 1, mixed: 2 };

type Result = ReturnType<typeof useReviewStats>;

const teardown: (() => void)[] = [];

afterEach(() => {
    for (const dispose of teardown.splice(0)) act(() => dispose());
    vi.unstubAllGlobals();
});

function Probe({
    type,
    onRender,
}: {
    type: CommentContentTypeEnum;
    onRender: (result: Result) => void;
}) {
    onRender(useReviewStats({ content_type: type, slug: SLUG }));
    return null;
}

async function mount(queryClient: QueryClient, type: CommentContentTypeEnum) {
    const container = document.createElement('div');
    const root = createRoot(container);
    const renders: Result[] = [];

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <Probe type={type} onRender={(value) => renders.push(value)} />
            </QueryClientProvider>,
        ),
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    teardown.push(() => root.unmount());

    return renders;
}

const newQueryClient = () =>
    new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });

const EMPTY = { stats: undefined, commentsCount: undefined };

describe.each(REVIEW_TYPES)('useReviewStats(%s)', (type) => {
    const key = contentInfoOptions(type, SLUG).queryKey;

    it('reads the review stats from the info query through one observer', async () => {
        const queryClient = newQueryClient();
        queryClient.setQueryData(key, {
            review_stats: REVIEW_STATS,
            comments_count: 12,
        } as never);

        const renders = await mount(queryClient, type);

        expect(renders.at(-1)).toEqual({
            stats: REVIEW_STATS,
            commentsCount: 12,
        });
        const queries = queryClient.getQueryCache().getAll();
        expect(queries.map((query) => query.queryHash)).toEqual([hashKey(key)]);
        expect(queries[0].getObserversCount()).toBe(1);
    });

    it('stays empty and fetches only its own info while loading', async () => {
        const fetchSpy = vi.fn(() => new Promise<Response>(() => {}));
        vi.stubGlobal('fetch', fetchSpy);
        const queryClient = newQueryClient();

        const renders = await mount(queryClient, type);

        expect(renders.at(-1)).toEqual(EMPTY);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(
            queryClient
                .getQueryCache()
                .getAll()
                .map((query) => query.queryHash),
        ).toEqual([hashKey(key)]);
    });
});

describe.each(OTHER_TYPES)('useReviewStats(%s)', (type) => {
    it('never fetches and ignores its cached info', async () => {
        const fetchSpy = vi.fn(() => new Promise<Response>(() => {}));
        vi.stubGlobal('fetch', fetchSpy);
        const key = contentInfoOptions(type, SLUG).queryKey;
        const queryClient = newQueryClient();
        queryClient.setQueryData(key, { comments_count: 5 } as never);

        const renders = await mount(queryClient, type);

        expect(renders.at(-1)).toEqual(EMPTY);
        expect(fetchSpy).not.toHaveBeenCalled();
        expect(
            queryClient
                .getQueryCache()
                .getAll()
                .map((query) => query.queryHash),
        ).toEqual([hashKey(key)]);
    });
});
