import { CancelledError, type QueryClient } from '@tanstack/react-query';
import { isNotFound } from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';

import {
    animeSlugOptions,
    ContentTypeEnum,
    createRequestClient,
    HikkaApiError,
} from '@hikka/api';

import prefetchContent from './prefetch-content';

const apiClient = createRequestClient({ baseUrl: 'https://api.hikka.io' });
const slug = 'cowboy-bebop';

function createQueryClient(ensureQueryData: ReturnType<typeof vi.fn>) {
    return { ensureQueryData } as unknown as QueryClient;
}

describe('prefetchContent', () => {
    it('retries a fetch cancelled by an unmounting observer and resolves', async () => {
        const ensureQueryData = vi
            .fn()
            .mockRejectedValueOnce(new CancelledError())
            .mockResolvedValueOnce({ slug });

        await expect(
            prefetchContent({
                slug,
                content_type: ContentTypeEnum.ANIME,
                queryClient: createQueryClient(ensureQueryData),
                apiClient,
            }),
        ).resolves.toEqual({ slug });
        expect(ensureQueryData).toHaveBeenCalledTimes(2);
        expect(ensureQueryData.mock.lastCall?.[0].queryKey).toEqual(
            animeSlugOptions({ path: { slug }, client: apiClient }).queryKey,
        );
    });

    it('turns a 404 from the API into the router not-found', async () => {
        const ensureQueryData = vi
            .fn()
            .mockRejectedValue(
                new HikkaApiError('Not found', 404, 'not_found'),
            );

        const error = await prefetchContent({
            slug,
            content_type: ContentTypeEnum.MANGA,
            queryClient: createQueryClient(ensureQueryData),
            apiClient,
        }).catch((reason: unknown) => reason);

        expect(isNotFound(error)).toBe(true);
        expect(ensureQueryData).toHaveBeenCalledTimes(1);
    });

    it('rethrows any other API error unchanged', async () => {
        const apiError = new HikkaApiError('Server error', 500, 'server_error');
        const ensureQueryData = vi.fn().mockRejectedValue(apiError);

        await expect(
            prefetchContent({
                slug,
                content_type: ContentTypeEnum.USER,
                queryClient: createQueryClient(ensureQueryData),
                apiClient,
            }),
        ).rejects.toBe(apiError);
    });
});
