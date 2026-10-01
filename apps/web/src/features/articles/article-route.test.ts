import { QueryClient } from '@tanstack/react-query';
import { isNotFound } from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';

import { createRequestClient, HikkaApiError } from '@hikka/api';

import { Route } from '../../routes/_pages/articles/$slug';

type Loader = (ctx: unknown) => Promise<unknown>;

function runLoader(ensureQueryData: () => Promise<unknown>) {
    const queryClient = new QueryClient();
    Object.assign(queryClient, { ensureQueryData: vi.fn(ensureQueryData) });

    return (Route.options.loader as Loader)({
        params: { slug: 'test-article' },
        context: {
            queryClient,
            apiClient: createRequestClient({
                baseUrl: 'https://api.example.test',
            }),
        },
    });
}

describe('article layout loader', () => {
    it('returns the article for head', async () => {
        await expect(
            runLoader(async () => ({ slug: 'test-article' })),
        ).resolves.toEqual({ article: { slug: 'test-article' } });
    });

    it('maps a 404 to notFound', async () => {
        const error = await runLoader(async () => {
            throw new HikkaApiError('Not found', 404, 'system:not_found');
        }).catch((thrown: unknown) => thrown);

        expect(isNotFound(error)).toBe(true);
    });
});
