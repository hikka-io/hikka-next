import { AnimePaginationResponse, HikkaClient } from '@hikka/client';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { getQueryClient } from '@/core';

import {
    HikkaProvider,
    prefetchSearchAnimes,
    queryKeys,
    useSearchAnimes,
} from '../index';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    const client = new HikkaClient({
        baseUrl: 'https://api.hikka.io',
    });

    return ({ children }: { children: React.ReactNode }) => (
        <HikkaProvider queryClient={queryClient} client={client}>
            {children}
        </HikkaProvider>
    );
};

describe('useAnimeSearch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch anime search results when search args are provided', async () => {
        const searchArgs = {
            query: 'naruto',
        };

        const { result } = renderHook(() => useSearchAnimes(searchArgs), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        expect(Array.isArray(result.current.data?.list)).toBe(true);
    });

    it('should handle pagination parameters', async () => {
        const searchArgs = {
            query: 'naruto',
        };

        const { result } = renderHook(
            () =>
                useSearchAnimes({
                    args: searchArgs,
                    paginationArgs: { page: 2, size: 10 },
                }),
            {
                wrapper: createWrapper(),
            },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        expect(result.current.data?.list.length).toBeLessThanOrEqual(10);
    });

    it('should handle errors', async () => {
        const searchArgs = {
            query: 'i',
        };

        const { result } = renderHook(() => useSearchAnimes(searchArgs), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isFetching).toBe(false));
        expect(result.current.isError).toBe(true);
    });

    it('should handle empty search args', async () => {
        const searchArgs = {};

        const { result } = renderHook(() => useSearchAnimes(searchArgs), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        expect(Array.isArray(result.current.data?.list)).toBe(true);
    });
});

describe('prefetchAnimeSearch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should prefetch anime search results when search args are provided', async () => {
        const searchArgs = {
            query: 'naruto',
        };
        const queryClient = getQueryClient();

        await waitFor(() =>
            expect(
                prefetchSearchAnimes(queryClient, searchArgs),
            ).resolves.not.toThrow(),
        );

        const query = queryClient.getQueryData<AnimePaginationResponse>(
            queryKeys.anime.search({ ...searchArgs, page: 1, size: 15 }),
        );

        expect(query?.list.length).toBeGreaterThan(0);
    });

    it('should handle pagination parameters', async () => {
        const searchArgs = {
            query: 'naruto',
        };
        const queryClient = getQueryClient();

        await expect(
            prefetchSearchAnimes({
                args: searchArgs,
                paginationArgs: { page: 2, size: 10 },
            }),
        ).resolves.not.toThrow();
    });

    it('should handle empty search args', async () => {
        const searchArgs = {};
        const queryClient = getQueryClient();

        await expect(
            prefetchSearchAnimes({
                args: searchArgs,
                paginationArgs: { page: 2, size: 10 },
            }),
        ).resolves.not.toThrow();
    });

    it('should handle query options', async () => {
        const searchArgs = {
            query: 'naruto',
        };

        await expect(
            prefetchSearchAnimes({
                args: searchArgs,
                paginationArgs: { page: 2, size: 10 },
                staleTime: 1000,
                gcTime: 2000,
            }),
        ).resolves.not.toThrow();
    });
});
