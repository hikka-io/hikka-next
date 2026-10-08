import { QueryClient } from '@tanstack/react-query';
import { isNotFound } from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';

import { createRequestClient, HikkaApiError } from '@hikka/api';

import { Route } from '../../routes/_pages/collections/$reference';

function runLoader(result: () => Promise<unknown>) {
    const queryClient = new QueryClient();
    const ensureQueryData = vi.fn(result);
    Object.assign(queryClient, { ensureQueryData });
    const loader = Route.options.loader as (ctx: unknown) => Promise<unknown>;
    return loader({
        params: { reference: 'abc' },
        context: {
            queryClient,
            apiClient: createRequestClient({
                baseUrl: 'https://api.example.test',
            }),
        },
    });
}

describe('collection view loader', () => {
    it('returns the collection', async () => {
        const collection = { reference: 'abc', title: 'Title' };

        await expect(runLoader(async () => collection)).resolves.toEqual({
            collection,
        });
    });

    it('renders not found for an unknown reference', async () => {
        const error = await runLoader(async () => {
            throw new HikkaApiError('Not found', 404, 'system:not_found');
        }).catch((caught: unknown) => caught);

        expect(isNotFound(error)).toBe(true);
    });

    it('rethrows any other error', async () => {
        const failure = new HikkaApiError('Server', 500, 'system:error');

        await expect(
            runLoader(async () => Promise.reject(failure)),
        ).rejects.toBe(failure);
    });
});
