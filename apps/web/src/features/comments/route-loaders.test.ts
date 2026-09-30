import { QueryClient } from '@tanstack/react-query';
import { isNotFound } from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';

import { createRequestClient, HikkaApiError } from '@hikka/api';

import { Route as ThreadRoute } from '../../routes/_pages/comments/$content_type/$slug/$';
import { Route as CommentsRoute } from '../../routes/_pages/comments/$content_type/$slug/index';

type Deferred<T> = {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (error: unknown) => void;
};

function deferred<T>(): Deferred<T> {
    let resolve!: (value: T) => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

type QueryOptions = { queryKey: [{ _id: string }] };

function fakeContext() {
    const info = deferred<unknown>();
    const list = deferred<void>();
    const stats = deferred<void>();
    const started: string[] = [];

    const queryClient = new QueryClient();
    Object.assign(queryClient, {
        ensureQueryData: vi.fn((options: QueryOptions) => {
            started.push(options.queryKey[0]._id);
            return info.promise;
        }),
        prefetchInfiniteQuery: vi.fn((options: QueryOptions) => {
            started.push(options.queryKey[0]._id);
            return list.promise;
        }),
        prefetchQuery: vi.fn((options: QueryOptions) => {
            started.push(options.queryKey[0]._id);
            return stats.promise;
        }),
    });

    return {
        info,
        list,
        stats,
        started,
        context: {
            queryClient,
            apiClient: createRequestClient({
                baseUrl: 'https://api.example.test',
            }),
        },
    };
}

type Loader = (ctx: unknown) => Promise<unknown>;

const runLoader = (route: { options: { loader?: unknown } }, ctx: unknown) =>
    (route.options.loader as Loader)(ctx);

describe('comments index loader', () => {
    const args = (context: unknown, contentType: string) => ({
        params: { content_type: contentType, slug: 'test-slug' },
        deps: {},
        context,
    });

    it('starts the content and the comment list together', async () => {
        const { context, info, list, started } = fakeContext();
        const result = runLoader(CommentsRoute, args(context, 'anime'));

        await flush();
        expect(started).toEqual(['getCommentsList', 'animeSlug']);

        info.resolve({ slug: 'test-slug' });
        list.resolve();
        await expect(result).resolves.toEqual({
            content: { slug: 'test-slug' },
        });
    });

    it('starts the user content, comments and stats together', async () => {
        const { context, info, list, stats, started } = fakeContext();
        const result = runLoader(CommentsRoute, args(context, 'user'));

        await flush();
        expect(started).toHaveLength(3);
        expect(started).toContain('serviceUserStats');

        info.resolve({ username: 'test-slug' });
        list.resolve();
        stats.resolve();
        await expect(result).resolves.toBeDefined();
    });

    it('still turns a missing content into notFound', async () => {
        const { context, info, list } = fakeContext();
        const rejection = runLoader(
            CommentsRoute,
            args(context, 'anime'),
        ).catch((error) => error);

        await flush();
        list.resolve();
        info.reject(new HikkaApiError('Not found', 404, 'system:not_found'));

        expect(isNotFound(await rejection)).toBe(true);
    });
});

describe('comment thread loader', () => {
    const args = (context: unknown, splat: string | undefined) => ({
        params: {
            content_type: 'anime',
            slug: 'test-slug',
            _splat: splat,
        },
        context,
    });

    it('starts the content and the thread together', async () => {
        const { context, info, list, started } = fakeContext();
        const result = runLoader(ThreadRoute, args(context, 'abc-123'));

        await flush();
        expect(started).toHaveLength(2);
        expect(started).toContain('animeSlug');

        info.resolve({ slug: 'test-slug' });
        list.resolve();
        await expect(result).resolves.toEqual({
            content: { slug: 'test-slug' },
            commentReference: 'abc-123',
        });
    });

    it('requests only the content without a comment reference', async () => {
        const { context, info, started } = fakeContext();
        const result = runLoader(ThreadRoute, args(context, undefined));

        await flush();
        expect(started).toEqual(['animeSlug']);

        info.resolve({ slug: 'test-slug' });
        await expect(result).resolves.toBeDefined();
    });
});
