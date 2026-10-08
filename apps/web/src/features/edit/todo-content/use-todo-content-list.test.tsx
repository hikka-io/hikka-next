import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    getBrowserClient,
} from '@hikka/api';

import {
    type TodoContentType,
    useTodoContentList,
} from './use-todo-content-list';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type InfiniteOptions = {
    queryKey: readonly unknown[];
    enabled?: boolean;
    queryFn: (context: unknown) => Promise<unknown>;
};

const mocks = vi.hoisted(() => ({
    options: [] as unknown[],
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
    const actual =
        await importOriginal<typeof import('@tanstack/react-query')>();
    return {
        ...actual,
        useInfiniteQuery: ((options: unknown, client?: QueryClient) => {
            mocks.options.push(options);
            return actual.useInfiniteQuery(
                options as Parameters<typeof actual.useInfiniteQuery>[0],
                client,
            );
        }) as typeof actual.useInfiniteQuery,
    };
});

const BASE_URL = 'https://api.example.test';
const PAGE_SIZE = 20;
const PAGES = 3;
const SORT = ['title_ua:asc'];

type SentRequest = { path: string; page: string | null; body: string };

function todoAnime(slug: string) {
    return {
        item: {
            data_type: 'anime',
            media_type: 'tv',
            title_ua: null,
            title_en: null,
            title_ja: null,
            episodes_released: null,
            episodes_total: null,
            image: null,
            status: null,
            native_scored_by: 0,
            native_score: 0,
            scored_by: 0,
            score: 0,
            slug,
            start_date: null,
            end_date: null,
            created: null,
            updated: null,
            translated_ua: false,
            season: null,
            source: null,
            rating: null,
            year: null,
            mal_id: 1,
            studios: [],
            genres: [],
            synopsis_en: null,
            synopsis_ua: null,
        },
        issues: {
            title_ua_absent: true,
            title_en_absent: false,
            title_original_absent: false,
            synopsis_ua_absent: true,
            synopsis_en_absent: false,
        },
    };
}

// The backend pages on the `page` query parameter.
function todoBackend(sent: SentRequest[]): typeof fetch {
    return async (input) => {
        const request =
            input instanceof Request ? input : new Request(String(input));
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? 1);
        sent.push({
            path: url.pathname,
            page: url.searchParams.get('page'),
            body: await request.text(),
        });
        return new Response(
            JSON.stringify({
                list: [
                    todoAnime(`anime-${page}-a`),
                    todoAnime(`anime-${page}-b`),
                ],
                pagination: { page, pages: PAGES, total: PAGES * 2 },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    };
}

const teardown: (() => void)[] = [];
let sent: SentRequest[] = [];

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

beforeEach(() => {
    sent = [];
    mocks.options = [];
    getBrowserClient().setConfig({ fetch: todoBackend(sent) });
});

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
});

type ListResult = ReturnType<typeof useTodoContentList>;

async function renderList(contentType: TodoContentType, page: number) {
    const result: { current?: ListResult } = {};

    function Harness() {
        result.current = useTodoContentList(contentType, {
            filters: {},
            page,
            size: PAGE_SIZE,
            sort: SORT,
        });
        return null;
    }

    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000, retry: false } },
    });
    const root = createRoot(document.createElement('div'));
    teardown.push(() => root.unmount());

    await act(async () => {
        root.render(
            <QueryClientProvider client={queryClient}>
                <Harness />
            </QueryClientProvider>,
        );
    });
    await settle();

    return result as { current: ListResult };
}

async function settle() {
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
}

const slugs = (result: ListResult) =>
    result.list?.map(({ item }) => item.slug) ?? [];

describe('useTodoContentList load more', () => {
    it('requests the next page and appends new items', async () => {
        const result = await renderList(ContentTypeEnum.ANIME, 1);

        await act(async () => {
            await result.current.fetchNextPage();
        });
        await settle();

        expect(sent.map(({ path, page }) => [path, page])).toEqual([
            ['/edit/todo/anime', '1'],
            ['/edit/todo/anime', '2'],
        ]);
        expect(slugs(result.current)).toEqual([
            'anime-1-a',
            'anime-1-b',
            'anime-2-a',
            'anime-2-b',
        ]);
        expect(result.current.hasNextPage).toBe(true);
    });

    it('continues from a jumped page and stops at the last page', async () => {
        const result = await renderList(ContentTypeEnum.ANIME, 2);

        await act(async () => {
            await result.current.fetchNextPage();
        });
        await settle();

        expect(sent.map(({ page }) => page)).toEqual(['2', '3']);
        expect(new Set(slugs(result.current)).size).toBe(4);
        expect(result.current.hasNextPage).toBe(false);
    });

    it('keeps the page in the body and the page-scoped key', async () => {
        const result = await renderList(ContentTypeEnum.ANIME, 2);

        await act(async () => {
            await result.current.fetchNextPage();
        });
        await settle();

        expect(sent.map(({ body }) => body)).toEqual([
            '{"sort":["title_ua:asc"],"page":2}',
            '{"sort":["title_ua:asc"],"page":3}',
        ]);
        expect(result.current.queryKey[0]).toMatchObject({
            _id: 'getTodoAnimeList',
            query: { size: PAGE_SIZE, page: 2 },
        });
    });
});

describe.each([
    [ContentTypeEnum.ANIME, '/edit/todo/anime'],
    [ContentTypeEnum.MANGA, '/edit/todo/manga'],
    [ContentTypeEnum.NOVEL, '/edit/todo/novel'],
    [ContentTypeEnum.CHARACTER, '/edit/todo/characters'],
    [ContentTypeEnum.PERSON, '/edit/todo/people'],
] as const)('useTodoContentList (%s)', (contentType, path) => {
    it('sends the page param as the page query parameter', async () => {
        await renderList(contentType, 1);
        const enabled = (mocks.options as InfiniteOptions[]).filter(
            (options) => options.enabled,
        );
        expect(enabled.length).toBeGreaterThan(0);
        const [options] = enabled;
        sent.length = 0;

        await options
            .queryFn({
                pageParam: 4,
                queryKey: options.queryKey,
                signal: new AbortController().signal,
                meta: undefined,
                direction: 'forward',
            })
            .catch(() => undefined);

        expect(sent.map(({ path, page }) => [path, page])).toEqual([
            [path, '4'],
        ]);
    });
});
