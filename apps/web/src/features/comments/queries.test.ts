import { hashKey, QueryClient } from '@tanstack/react-query';
import { beforeAll, describe, expect, it } from 'vitest';

import {
    API_LIMITS,
    type Client,
    type CommentContentTypeEnum as CommentsContentType,
    type CommentsFilterArgs,
    ContentTypeEnum,
    configureBrowserClient,
    createRequestClient,
    getBrowserClient,
    getCommentsListInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';

import {
    type CommentOrder,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
    getCommentSort,
} from '@/utils/sort';

import type { CommentType } from './comment-type-options';
import {
    commentListPrefetchBody,
    commentThreadInfiniteOptions,
    THREAD_PAGE_SIZE,
} from './queries';
import type { Verdict } from './review/review';

const BASE_URL = 'https://api.example.test';
const slug = 'cowboy-bebop-f6f0ab';
const editId = '571627';

type ListOptions = ReturnType<typeof getCommentsListInfiniteOptions>;

type ComponentListProps = {
    content_type: CommentsContentType;
    slug: string;
    preview?: boolean;
    commentType?: CommentType;
    verdict?: Verdict | null;
    sort?: string;
    order?: CommentOrder;
};

function ssrRequestClient() {
    return createRequestClient({
        baseUrl: BASE_URL,
        internalBaseUrl: 'http://backend:8000',
        authToken: 'token',
    });
}

const headLoaderBody = (): CommentsFilterArgs => ({
    comment_type: 'all',
    sort: getCommentSort(),
});

// Copy of the list query in comment-list.tsx; the defaults are its local state and useCommentSort's.
function componentListOptions({
    content_type,
    slug,
    preview,
    commentType = 'all',
    verdict = null,
    sort = DEFAULT_COMMENT_SORT,
    order = DEFAULT_COMMENT_ORDER,
}: ComponentListProps) {
    return getCommentsListInfiniteOptions({
        path: { content_type, slug },
        body: {
            comment_type: commentType,
            sort: getCommentSort(sort, order),
            recommended:
                commentType === 'review' ? (verdict ?? undefined) : undefined,
        },
        query: preview ? { size: 3 } : undefined,
    });
}

const LOADER_CASES = [
    {
        route: 'anime/$slug',
        loader: (body: CommentsFilterArgs, client: Client) =>
            getCommentsListInfiniteOptions({
                path: { content_type: ContentTypeEnum.ANIME, slug },
                body,
                query: { size: 3 },
                client,
            }),
        component: () =>
            componentListOptions({
                content_type: ContentTypeEnum.ANIME,
                slug,
                preview: true,
            }),
    },
    {
        route: 'manga/$slug',
        loader: (body: CommentsFilterArgs, client: Client) =>
            getCommentsListInfiniteOptions({
                path: { content_type: ContentTypeEnum.MANGA, slug },
                body,
                query: { size: 3 },
                client,
            }),
        component: () =>
            componentListOptions({
                content_type: ContentTypeEnum.MANGA,
                slug,
                preview: true,
            }),
    },
    {
        route: 'novel/$slug',
        loader: (body: CommentsFilterArgs, client: Client) =>
            getCommentsListInfiniteOptions({
                path: { content_type: ContentTypeEnum.NOVEL, slug },
                body,
                query: { size: 3 },
                client,
            }),
        component: () =>
            componentListOptions({
                content_type: ContentTypeEnum.NOVEL,
                slug,
                preview: true,
            }),
    },
    {
        route: 'edit/$editId',
        loader: (body: CommentsFilterArgs, client: Client) =>
            getCommentsListInfiniteOptions({
                path: {
                    content_type: 'edit' as CommentsContentType,
                    slug: editId,
                },
                body,
                client,
            }),
        component: () =>
            componentListOptions({
                content_type: ContentTypeEnum.EDIT,
                slug: editId,
            }),
    },
];

async function sentRequest(options: ListOptions, client: Client) {
    let sent: Request | undefined;
    client.setConfig({
        fetch: async (input) => {
            sent =
                input instanceof Request ? input : new Request(String(input));
            return new Response(null, { status: 401 });
        },
    });
    await new QueryClient()
        .fetchInfiniteQuery({ ...options, ...paginationPageParam() })
        .catch(() => undefined);
    if (!sent) throw new Error('no request was sent');
    const url = new URL(sent.url);
    return {
        method: sent.method,
        path: `${url.pathname}${url.search}`,
        body: await sent.text(),
    };
}

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

describe('commentListPrefetchBody', () => {
    it('is exactly the unfiltered loader body', () => {
        const body = commentListPrefetchBody();

        expect(body).toStrictEqual(headLoaderBody());
        expect(Object.keys(body)).toEqual(['comment_type', 'sort']);
        expect(body).not.toHaveProperty('recommended');
    });

    it('does not match a verdict-filtered component key', () => {
        const loaderKey = getCommentsListInfiniteOptions({
            path: { content_type: ContentTypeEnum.ANIME, slug },
            body: commentListPrefetchBody(),
            query: { size: 3 },
            client: ssrRequestClient(),
        }).queryKey;
        const filtered = componentListOptions({
            content_type: ContentTypeEnum.ANIME,
            slug,
            preview: true,
            commentType: 'review',
            verdict: 'yes',
        }).queryKey;

        expect(hashKey(loaderKey)).not.toBe(hashKey(filtered));
    });
});

describe.each(LOADER_CASES)('$route comments prefetch', ({
    loader,
    component,
}) => {
    it('keeps the loader key and options of the inline body', () => {
        const client = ssrRequestClient();
        const next = loader(commentListPrefetchBody(), client);
        const head = loader(headLoaderBody(), client);

        expect(next.queryKey).toStrictEqual(head.queryKey);
        expect(Object.keys(next)).toEqual(Object.keys(head));
    });

    it('hashes equal to the component default key', () => {
        const loaderKey = loader(
            commentListPrefetchBody(),
            ssrRequestClient(),
        ).queryKey;
        const componentKey = component().queryKey;

        expect(hashKey(loaderKey)).toBe(hashKey(componentKey));
        expect(loaderKey).toEqual(componentKey);
    });

    it('sends the same request as the component query', async () => {
        const client = createRequestClient({
            baseUrl: BASE_URL,
            authToken: 'token',
        });
        const fromLoader = await sentRequest(
            loader(commentListPrefetchBody(), client),
            client,
        );
        const fromComponent = await sentRequest(
            component(),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('POST');
        expect(fromLoader).toEqual(fromComponent);
        expect(JSON.parse(fromLoader.body)).toEqual(headLoaderBody());
    });
});

describe('commentThreadInfiniteOptions', () => {
    const reference = '0d3b8a44-5d69-4f0e-9a3c-2f3e2b1c9d10';

    it('pages the thread at the API maximum', () => {
        expect(THREAD_PAGE_SIZE).toBe(API_LIMITS.pageSize.max);
    });

    it('keeps the thread key', () => {
        expect(commentThreadInfiniteOptions('x').queryKey).toStrictEqual([
            {
                _id: 'thread',
                _infinite: true,
                baseUrl: BASE_URL,
                path: { comment_reference: 'x' },
                query: { flat: true, size: THREAD_PAGE_SIZE },
            },
        ]);
    });

    it('shares the key between the thread loader and useCommentThread', () => {
        const loaderKey = commentThreadInfiniteOptions(
            reference,
            ssrRequestClient(),
        ).queryKey;
        const hookKey = commentThreadInfiniteOptions(reference).queryKey;

        expect(loaderKey).toStrictEqual(hookKey);
        expect(hashKey(loaderKey)).toBe(hashKey(hookKey));
    });
});
