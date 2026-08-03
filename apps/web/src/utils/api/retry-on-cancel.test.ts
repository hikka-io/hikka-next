import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { retryOnCancel } from './retry-on-cancel';

const queryKey = ['anime', 'cowboy-bebop'];

function createClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { staleTime: 60_000, gcTime: Infinity, retry: false },
        },
    });
}

/** Mirrors the generated client: reading `signal` marks the fetch abortable. */
function slowQueryFn() {
    return vi.fn(
        ({ signal }: { signal: AbortSignal }) =>
            new Promise((resolve, reject) => {
                const timeout = setTimeout(() => resolve('data'), 20);
                signal.addEventListener('abort', () => {
                    clearTimeout(timeout);
                    reject(new Error('aborted'));
                });
            }),
    );
}

describe('retryOnCancel', () => {
    it('recovers when an unmounting observer aborts the fetch the loader awaits', async () => {
        const queryClient = createClient();
        const queryFn = slowQueryFn();

        const observer = new QueryObserver(queryClient, { queryKey, queryFn });
        const unsubscribe = observer.subscribe(() => {});

        const loaderData = retryOnCancel(() =>
            queryClient.ensureQueryData({ queryKey, queryFn }),
        );

        unsubscribe();

        await expect(loaderData).resolves.toBe('data');
        expect(queryFn).toHaveBeenCalledTimes(2);
    });

    it('resolves without a second fetch when nothing cancels', async () => {
        const queryClient = createClient();
        const queryFn = slowQueryFn();

        await expect(
            retryOnCancel(() =>
                queryClient.ensureQueryData({ queryKey, queryFn }),
            ),
        ).resolves.toBe('data');
        expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('rethrows a failing query without retrying it', async () => {
        const queryClient = createClient();
        const queryFn = vi.fn(() => Promise.reject(new Error('boom')));

        await expect(
            retryOnCancel(() =>
                queryClient.ensureQueryData({ queryKey, queryFn }),
            ),
        ).rejects.toThrow('boom');
        expect(queryFn).toHaveBeenCalledTimes(1);
    });
});
