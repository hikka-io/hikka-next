import { paginationPageParam } from './pagination';

type Page = { pagination: { page: number; pages: number } };

describe('paginationPageParam', () => {
    const { initialPageParam, getNextPageParam } = paginationPageParam<Page>();

    it('starts at page 1', () => {
        expect(initialPageParam).toBe(1);
    });
    it('returns the next page until the last', () => {
        expect(getNextPageParam({ pagination: { page: 1, pages: 3 } })).toBe(2);
        expect(getNextPageParam({ pagination: { page: 2, pages: 3 } })).toBe(3);
    });
    it('returns null on the last page', () => {
        expect(
            getNextPageParam({ pagination: { page: 3, pages: 3 } }),
        ).toBeNull();
    });
});
