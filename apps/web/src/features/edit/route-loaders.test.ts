import { QueryClient } from '@tanstack/react-query';
import { isNotFound } from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';

import { createRequestClient, HikkaApiError } from '@hikka/api';

import { Route as EditRoute } from '../../routes/_pages/edit/$editId';
import { Route as EditViewRoute } from '../../routes/_pages/edit/$editId/index';
import { Route as EditUpdateRoute } from '../../routes/_pages/edit/$editId/update';

type QueryOptions = { queryKey: [{ _id: string }] };

function fakeContext() {
    let resolveEdit!: (value: unknown) => void;
    let rejectEdit!: (error: unknown) => void;
    const edit = new Promise((resolve, reject) => {
        resolveEdit = resolve;
        rejectEdit = reject;
    });
    const started: string[] = [];

    const queryClient = new QueryClient();
    Object.assign(queryClient, {
        ensureQueryData: vi.fn((options: QueryOptions) => {
            started.push(options.queryKey[0]._id);
            return edit;
        }),
        prefetchInfiniteQuery: vi.fn((options: QueryOptions) => {
            started.push(options.queryKey[0]._id);
            return new Promise<void>(() => {});
        }),
    });

    return {
        started,
        resolveEdit,
        rejectEdit,
        context: {
            queryClient,
            apiClient: createRequestClient({
                baseUrl: 'https://api.example.test',
            }),
        },
    };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

type Loader = (ctx: unknown) => Promise<unknown>;

const runLoader = (
    route: { options: { loader?: unknown } },
    context: unknown,
) =>
    (route.options.loader as Loader)({
        params: { editId: '132128' },
        context,
    });

describe('edit layout loader', () => {
    it('loads only the edit', async () => {
        const { context, started, resolveEdit } = fakeContext();
        const result = runLoader(EditRoute, context);

        await flush();
        expect(started).toEqual(['getEdit']);

        resolveEdit({ edit_id: 132128 });
        await expect(result).resolves.toEqual({
            edit: { edit_id: 132128 },
        });
    });

    it('renders not found for an unknown edit', async () => {
        const { context, rejectEdit } = fakeContext();
        const result = runLoader(EditRoute, context);

        rejectEdit(new HikkaApiError('Not found', 404, 'system:not_found'));
        const error = await result.catch((caught: unknown) => caught);

        expect(isNotFound(error)).toBe(true);
    });

    it('rethrows any other error', async () => {
        const { context, rejectEdit } = fakeContext();
        const result = runLoader(EditRoute, context);
        const failure = new HikkaApiError('Server', 500, 'system:error');

        rejectEdit(failure);

        await expect(result).rejects.toBe(failure);
    });
});

describe('edit view loader', () => {
    it('prefetches the comments of the edit', async () => {
        const { context, started } = fakeContext();
        void runLoader(EditViewRoute, context);

        await flush();
        expect(started).toEqual(['getCommentsList']);
    });

    it('leaves the comments out of the update page', () => {
        expect(EditUpdateRoute.options.loader).toBeUndefined();
    });
});
