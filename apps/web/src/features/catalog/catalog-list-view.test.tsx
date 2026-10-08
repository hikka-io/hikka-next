import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { afterEach, describe, expect, it, vi } from 'vitest';

import CatalogListView from './catalog-list-view';

const mocks = vi.hoisted(() => ({
    pagination: [] as Record<string, unknown>[],
}));

vi.mock('@/components/page-pagination', () => ({
    default: (props: Record<string, unknown>) => {
        mocks.pagination.push(props);
        return null;
    },
}));

vi.mock('@/components/ui/stack', () => ({
    default: ({ children }: { children: ReactNode }) => children,
}));

const QUERY_KEY = [{ _id: 'searchAnimes', query: { page: 2 } }];
const PAGINATION = { page: 2, pages: 9 };

afterEach(() => {
    mocks.pagination.length = 0;
});

const render = (
    hasMultiplePages: boolean,
    pagination: typeof PAGINATION | undefined,
) =>
    renderToStaticMarkup(
        <CatalogListView
            list={['a', 'b']}
            view="list"
            isLoading={false}
            isFetchingNextPage={false}
            hasNextPage={false}
            fetchNextPage={() => {}}
            hasMultiplePages={hasMultiplePages}
            pagination={pagination}
            removeQueryKey={QUERY_KEY}
            renderGridItem={(item) => <span key={item}>{item}</span>}
            renderListItem={(item) => <span key={item}>{item}</span>}
        />,
    );

describe('CatalogListView page jump', () => {
    it('resets the list query when more than one page is loaded', () => {
        render(true, PAGINATION);

        expect(mocks.pagination).toEqual([
            { pagination: PAGINATION, resetQueryKey: QUERY_KEY },
        ]);
    });

    it('keeps the list query with a single loaded page', () => {
        render(false, PAGINATION);

        expect(mocks.pagination).toEqual([
            { pagination: PAGINATION, resetQueryKey: undefined },
        ]);
    });

    it('renders no pagination without pagination data', () => {
        render(true, undefined);

        expect(mocks.pagination).toEqual([]);
    });
});
