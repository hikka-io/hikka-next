import { QueryClient } from '@tanstack/react-query';
import { isNotFound, isRedirect } from '@tanstack/react-router';
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
    const thread = deferred<unknown>();
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
        ensureInfiniteQueryData: vi.fn((options: QueryOptions) => {
            started.push(options.queryKey[0]._id);
            return thread.promise;
        }),
    });

    return {
        info,
        list,
        stats,
        thread,
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

    const root = {
        reference: 'abc-123',
        author: { username: 'olexh' },
        review: null,
        hidden: false,
        text: 'Hello **there** :spoiler[secret]',
    };
    const threadPage = (list: unknown[]) => ({
        pages: [{ list, pagination: { total: list.length } }],
    });

    it('starts the content and the thread together', async () => {
        const { context, info, thread, started } = fakeContext();
        const result = runLoader(ThreadRoute, args(context, 'abc-123'));

        await flush();
        expect(started).toEqual(['animeSlug', 'thread']);

        info.resolve({ slug: 'test-slug' });
        thread.resolve(threadPage([root, { ...root, reference: 'reply' }]));
        await expect(result).resolves.toEqual({
            content: { slug: 'test-slug' },
            comment: root,
        });
    });

    it('requests only the content without a comment reference', async () => {
        const { context, info, started } = fakeContext();
        const result = runLoader(ThreadRoute, args(context, undefined));

        await flush();
        expect(started).toEqual(['animeSlug']);

        info.resolve({ slug: 'test-slug' });
        await expect(result).resolves.toEqual({
            content: { slug: 'test-slug' },
            comment: undefined,
        });
    });

    it('turns a missing comment into notFound', async () => {
        const { context, info, thread } = fakeContext();
        const rejection = runLoader(
            ThreadRoute,
            args(context, 'abc-123'),
        ).catch((error) => error);

        await flush();
        info.resolve({ slug: 'test-slug' });
        thread.reject(new HikkaApiError('Not found', 404, 'comment:not-found'));

        expect(isNotFound(await rejection)).toBe(true);
    });

    it('renders without the comment when the thread fails otherwise', async () => {
        const { context, info, thread } = fakeContext();
        const result = runLoader(ThreadRoute, args(context, 'abc-123'));

        await flush();
        info.resolve({ slug: 'test-slug' });
        thread.reject(new HikkaApiError('Hidden', 400, 'comment:hidden'));

        await expect(result).resolves.toEqual({
            content: { slug: 'test-slug' },
            comment: undefined,
        });
    });

    type Head = (ctx: object) => {
        meta: { name?: string; title?: string; content?: string }[];
    };
    const head = (loaderData: object | undefined) => {
        const { meta } = (ThreadRoute.options.head as unknown as Head)({
            loaderData,
            params: { content_type: 'anime', slug: 'test-slug' },
        });
        return {
            title: meta.find((tag) => tag.title)?.title,
            description: meta.find((tag) => tag.name === 'description')
                ?.content,
        };
    };

    it('heads the page with the root comment', () => {
        expect(
            head({ content: { title_ua: 'Фрірен' }, comment: root }),
        ).toEqual({
            title: expect.stringContaining('Коментар @olexh / Фрірен'),
            description: 'Hello there [спойлер]',
        });
    });

    it('keeps a hidden comment out of the description', () => {
        expect(
            head({ content: undefined, comment: { ...root, hidden: true } })
                .description,
        ).not.toContain('Hello');
    });
});

describe('comments route guards', () => {
    type BeforeLoad = (ctx: { params: object }) => unknown;

    const redirectFrom = (
        route: { options: { beforeLoad?: unknown } },
        contentType: string,
    ) => {
        const beforeLoad = route.options.beforeLoad as BeforeLoad | undefined;
        try {
            beforeLoad?.({
                params: { content_type: contentType, slug: 'test-slug' },
            });
        } catch (error) {
            if (isRedirect(error)) return error.options;
            throw error;
        }
        return undefined;
    };

    it.each([CommentsRoute, ThreadRoute])(
        'redirects an unknown content type home from beforeLoad',
        (route) => {
            expect(redirectFrom(route, 'unknown')?.to).toBe('/');
        },
    );

    it.each([CommentsRoute, ThreadRoute])(
        'lets a known content type through',
        (route) => {
            expect(redirectFrom(route, 'anime')).toBeUndefined();
            expect(redirectFrom(route, 'user')).toBeUndefined();
        },
    );
});
