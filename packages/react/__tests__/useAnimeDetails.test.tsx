import { HikkaClient } from '@hikka/client';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { HikkaProvider, useAnimeDetails } from '../index';

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

describe('useAnimeDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch anime details when slug is provided', async () => {
        const { result } = renderHook(
            () => useAnimeDetails('tu-bian-yingxiong-x-8d3a06'),
            {
                wrapper: createWrapper(),
            },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.slug).toEqual('tu-bian-yingxiong-x-8d3a06');
    });

    it('should not fetch when slug is not provided', async () => {
        const { result } = renderHook(() => useAnimeDetails(''), {
            wrapper: createWrapper(),
        });

        expect(result.current.fetchStatus).toBe('idle');
    });

    it('should handle errors', async () => {
        const { result } = renderHook(() => useAnimeDetails('test-anime'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isFetching).toBe(false));
        expect(result.current.isError).toBe(true);
    });
});
