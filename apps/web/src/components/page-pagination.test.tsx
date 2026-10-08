import { renderToStaticMarkup } from 'react-dom/server';

import { afterEach, describe, expect, it, vi } from 'vitest';

import PagePagination from './page-pagination';

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    removeQueries: vi.fn(),
    sticky: [] as {
        page: number;
        pages: number;
        setPage: (page: number) => void;
    }[],
}));

vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => mocks.navigate,
}));

vi.mock('@tanstack/react-query', () => ({
    useQueryClient: () => ({ removeQueries: mocks.removeQueries }),
}));

vi.mock('@/components/ui/pagination', () => ({
    StickyPagination: (props: (typeof mocks.sticky)[number]) => {
        mocks.sticky.push(props);
        return null;
    },
}));

type NavigateOptions = {
    to: string;
    replace?: boolean;
    search: (prev: Record<string, unknown>) => Record<string, unknown>;
};

const PAGINATION = { page: 2, pages: 7, total: 140 };
const RESET_KEY = [{ _id: 'getCollections', query: { page: 2 } }];

afterEach(() => {
    mocks.navigate.mockReset();
    mocks.removeQueries.mockReset();
    mocks.sticky.length = 0;
});

function changePage(page: number, resetQueryKey?: unknown[]) {
    renderToStaticMarkup(
        <PagePagination
            pagination={PAGINATION}
            resetQueryKey={resetQueryKey}
        />,
    );

    expect(mocks.sticky).toHaveLength(1);
    mocks.sticky[0].setPage(page);

    expect(mocks.navigate).toHaveBeenCalledTimes(1);
    return mocks.navigate.mock.calls[0][0] as NavigateOptions;
}

describe('PagePagination', () => {
    it('renders the sticky pagination for the current page', () => {
        renderToStaticMarkup(<PagePagination pagination={PAGINATION} />);

        expect(mocks.sticky[0]).toMatchObject({ page: 2, pages: 7 });
    });

    it('pushes a new history entry on the current route', () => {
        const options = changePage(3);

        expect(options.to).toBe('.');
        expect(options.replace).not.toBe(true);
    });

    it('keeps the other search params and sets the new page', () => {
        const { search } = changePage(3);

        expect(
            search({
                sort: 'created',
                order: 'asc',
                genres: ['action'],
                page: 2,
            }),
        ).toEqual({
            sort: 'created',
            order: 'asc',
            genres: ['action'],
            page: 3,
        });
    });

    it('writes page 1 explicitly for the first page', () => {
        const { search } = changePage(1);

        expect(search({ sort: 'created', page: 4 })).toEqual({
            sort: 'created',
            page: 1,
        });
    });

    it('leaves the query cache alone without a reset key', () => {
        changePage(3);

        expect(mocks.removeQueries).not.toHaveBeenCalled();
    });

    it('removes the reset query before navigating', () => {
        changePage(3, RESET_KEY);

        expect(mocks.removeQueries).toHaveBeenCalledTimes(1);
        expect(mocks.removeQueries).toHaveBeenCalledWith({
            queryKey: RESET_KEY,
        });
        expect(mocks.removeQueries.mock.invocationCallOrder[0]).toBeLessThan(
            mocks.navigate.mock.invocationCallOrder[0],
        );
    });
});
