import { paginatedInfiniteOptions } from './pagination';

// The helper returns its input's `TOptions` so it preserves the generated page
// type for consumers; the runtime-added pagination props are surfaced here for
// assertions via this view.
type Decorated = {
    queryKey: readonly [Record<string, unknown>, ...unknown[]];
    initialPageParam: number;
    getNextPageParam: (lastPage: {
        pagination: { page: number; pages: number };
    }) => number | null;
};

const decorate = (
    options: Parameters<typeof paginatedInfiniteOptions>[0],
    page?: number,
) => paginatedInfiniteOptions(options, page) as unknown as Decorated;

describe('paginatedInfiniteOptions', () => {
    const baseOptions = {
        queryFn: async () => ({
            list: [],
            pagination: { page: 1, pages: 3 },
        }),
        queryKey: [
            {
                _id: 'getCollections',
                baseUrl: 'https://api.hikka.io',
                _infinite: true,
                body: { sort: ['system_ranking:desc'] },
                query: { size: 15 },
            },
        ] as const,
    };

    it('folds the page into the query-key query object', () => {
        const result = decorate(baseOptions, 3);
        expect((result.queryKey[0] as Record<string, unknown>).query).toEqual({
            size: 15,
            page: 3,
        });
    });

    it('preserves other key fields (_id, baseUrl, body)', () => {
        const key = decorate(baseOptions, 3).queryKey[0] as Record<
            string,
            unknown
        >;
        expect(key._id).toBe('getCollections');
        expect(key.baseUrl).toBe('https://api.hikka.io');
        expect(key.body).toEqual({ sort: ['system_ranking:desc'] });
    });

    it('sets initialPageParam to the requested page', () => {
        expect(decorate(baseOptions, 4).initialPageParam).toBe(4);
    });

    it('defaults to page 1', () => {
        const result = decorate(baseOptions);
        expect(
            (result.queryKey[0] as Record<string, unknown>).query,
        ).toMatchObject({ page: 1 });
        expect(result.initialPageParam).toBe(1);
    });

    it('wires a page/pages getNextPageParam that stops past the last page', () => {
        const { getNextPageParam } = decorate(baseOptions, 1);
        expect(getNextPageParam({ pagination: { page: 1, pages: 3 } })).toBe(2);
        expect(
            getNextPageParam({ pagination: { page: 3, pages: 3 } }),
        ).toBeNull();
    });

    it('handles a key that has no query object yet', () => {
        const noQuery = {
            queryFn: baseOptions.queryFn,
            queryKey: [{ _id: 'getEdits', baseUrl: 'b', body: {} }] as const,
        };
        const result = decorate(noQuery, 2);
        expect((result.queryKey[0] as Record<string, unknown>).query).toEqual({
            page: 2,
        });
    });

    it('does not mutate the input options', () => {
        const result = decorate(baseOptions, 5);
        expect(result).not.toBe(baseOptions);
        expect(
            (baseOptions.queryKey[0] as Record<string, unknown>).query,
        ).toEqual({ size: 15 });
    });
});
