import { renderToStaticMarkup } from 'react-dom/server';

import { afterEach, describe, expect, it, vi } from 'vitest';

import TodoContentList from './todo-content-list';

const QUERY_KEY = [{ _id: 'getTodoAnimeList', query: { page: 3 } }];
const PAGINATION = { page: 3, pages: 12, total: 240 };

const mocks = vi.hoisted(() => ({
    pagination: [] as Record<string, unknown>[],
    loadedPages: 1,
}));

vi.mock('@/components/page-pagination', () => ({
    default: (props: Record<string, unknown>) => {
        mocks.pagination.push(props);
        return null;
    },
}));

vi.mock('./todo-content-card', () => ({ TodoContentCard: () => null }));

vi.mock('./use-todo-filters', () => ({
    useTodoFilters: () => ({ contentType: 'anime' }),
}));

vi.mock('./use-todo-content-query', () => ({
    useTodoContentQuery: () => ({
        list: [{ item: { slug: 'one' } }],
        data: { pages: Array.from({ length: mocks.loadedPages }) },
        fetchNextPage: () => {},
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        pagination: PAGINATION,
        queryKey: QUERY_KEY,
    }),
}));

afterEach(() => {
    mocks.pagination.length = 0;
    mocks.loadedPages = 1;
});

describe('TodoContentList page jump', () => {
    it('resets the list query when more than one page is loaded', () => {
        mocks.loadedPages = 2;
        renderToStaticMarkup(<TodoContentList />);

        expect(mocks.pagination).toEqual([
            { pagination: PAGINATION, resetQueryKey: QUERY_KEY },
        ]);
    });

    it('keeps the list query with a single loaded page', () => {
        renderToStaticMarkup(<TodoContentList />);

        expect(mocks.pagination).toEqual([
            { pagination: PAGINATION, resetQueryKey: undefined },
        ]);
    });
});
