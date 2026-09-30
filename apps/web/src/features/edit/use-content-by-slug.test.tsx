import { act } from 'react';
import { createRoot } from 'react-dom/client';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { configureBrowserClient, EditContentTypeEnum } from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';

import { useContentBySlug } from './use-content-by-slug';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

configureBrowserClient({ baseUrl: 'https://api.example.test' });

const SLUG = 'some-slug';

const TYPES = Object.values(EditContentTypeEnum);

type Result = ReturnType<typeof useContentBySlug>;

const teardown: (() => void)[] = [];

afterEach(() => {
    for (const dispose of teardown.splice(0)) act(() => dispose());
    vi.unstubAllGlobals();
});

function Probe({
    type,
    onRender,
}: {
    type: EditContentTypeEnum;
    onRender: (result: Result) => void;
}) {
    onRender(useContentBySlug(type, SLUG));
    return null;
}

async function mount(queryClient: QueryClient, type: EditContentTypeEnum) {
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

describe.each(TYPES)('useContentBySlug(%s)', (type) => {
    const key = contentInfoOptions(type, SLUG).queryKey;

    it('returns the cached info of its own type through one observer', async () => {
        const content = { slug: SLUG, data_type: type };
        const queryClient = newQueryClient();
        queryClient.setQueryData(key, content as never);

        const renders = await mount(queryClient, type);

        expect(renders.at(-1)).toBe(content);
        const queries = queryClient.getQueryCache().getAll();
        expect(queries.map((query) => query.queryHash)).toEqual([hashKey(key)]);
        expect(queries[0].getObserversCount()).toBe(1);
    });

    it('returns undefined and fetches only its own info while loading', async () => {
        const fetchSpy = vi.fn(() => new Promise<Response>(() => {}));
        vi.stubGlobal('fetch', fetchSpy);
        const queryClient = newQueryClient();

        const renders = await mount(queryClient, type);

        expect(renders.at(-1)).toBeUndefined();
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(
            queryClient
                .getQueryCache()
                .getAll()
                .map((query) => query.queryHash),
        ).toEqual([hashKey(key)]);
    });
});
