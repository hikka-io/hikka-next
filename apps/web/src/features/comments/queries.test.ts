import { hashKey, QueryClient } from '@tanstack/react-query';
import { beforeAll, describe, expect, it } from 'vitest';

import {
    API_LIMITS,
    type Client,
    type CommentContentTypeEnum,
    type CommentTypeEnum,
    ContentTypeEnum,
    configureBrowserClient,
    createRequestClient,
    getBrowserClient,
    getCommentsListInfiniteOptions,
    getCommentsUserInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';

import { commentsSearchSchema } from '@/utils/search-schemas';
import {
    type CommentOrder,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
    getCommentSort,
} from '@/utils/sort';

import { Route as CommentsRoute } from '../../routes/_pages/comments/$content_type/$slug/index';
import { Route as EditViewRoute } from '../../routes/_pages/edit/$editId/index';
import {
    commentListOptions,
    commentThreadOptions,
    THREAD_PAGE_SIZE,
    userCommentListOptions,
} from './queries';
import type { Verdict } from './review/review';

const BASE_URL = 'https://api.example.test';
const slug = 'cowboy-bebop-f6f0ab';
const editId = '571627';

type ListOptions = ReturnType<typeof getCommentsListInfiniteOptions>;

type ComponentListProps = {
    content_type: CommentContentTypeEnum;
    slug: string;
    preview?: boolean;
    commentType?: CommentTypeEnum;
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

// Copy of the list query in HEAD comment-list.tsx; the defaults are its local state and useCommentSort's.
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

// Copy of the list query in HEAD user-comment-list.tsx.
function componentUserListOptions({
    username,
    commentType = 'all',
    firstLevelOnly = false,
    sort = DEFAULT_COMMENT_SORT,
    order = DEFAULT_COMMENT_ORDER,
}: {
    username: string;
    commentType?: CommentTypeEnum;
    firstLevelOnly?: boolean;
    sort?: string;
    order?: CommentOrder;
}) {
    return getCommentsUserInfiniteOptions({
        path: { username },
        body: {
            comment_type: commentType,
            sort: getCommentSort(sort, order),
            first_level_only: firstLevelOnly || undefined,
        },
    });
}

const COMPONENT_CASES: ComponentListProps[] = [
    { content_type: ContentTypeEnum.ANIME, slug, preview: true },
    { content_type: ContentTypeEnum.MANGA, slug, preview: true },
    { content_type: ContentTypeEnum.EDIT, slug: editId },
    {
        content_type: ContentTypeEnum.ANIME,
        slug,
        commentType: 'review',
        verdict: 'yes' as Verdict,
    },
    {
        content_type: ContentTypeEnum.ANIME,
        slug,
        commentType: 'comment',
        verdict: 'yes' as Verdict,
        sort: 'created',
        order: 'asc',
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

describe('commentListOptions', () => {
    it.each(COMPONENT_CASES)(
        'keeps the HEAD component key: $content_type $commentType $sort',
        ({ content_type, slug: target, ...filters }) => {
            const key = commentListOptions(
                content_type,
                target,
                filters,
            ).queryKey;
            const head = componentListOptions({
                content_type,
                slug: target,
                ...filters,
            }).queryKey;

            expect(hashKey(key)).toBe(hashKey(head));
        },
    );

    it('keys a verdict-filtered review list apart from the default list', () => {
        expect(
            hashKey(
                commentListOptions(ContentTypeEnum.ANIME, slug, {
                    commentType: 'review',
                    verdict: 'yes' as Verdict,
                }).queryKey,
            ),
        ).not.toBe(
            hashKey(commentListOptions(ContentTypeEnum.ANIME, slug).queryKey),
        );
    });

    it('sends the HEAD request of the edit comments', async () => {
        const client = createRequestClient({
            baseUrl: BASE_URL,
            authToken: 'token',
        });
        const fromLoader = await sentRequest(
            commentListOptions(ContentTypeEnum.EDIT, editId, {}, client),
            client,
        );
        const fromComponent = await sentRequest(
            componentListOptions({
                content_type: ContentTypeEnum.EDIT,
                slug: editId,
            }),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('POST');
        expect(fromLoader).toEqual(fromComponent);
        expect(JSON.parse(fromLoader.body)).toEqual({
            comment_type: 'all',
            sort: getCommentSort(),
        });
    });
});

describe('userCommentListOptions', () => {
    it.each([
        {},
        { commentType: 'review' as const },
        { firstLevelOnly: true, sort: 'created', order: 'asc' as const },
    ])('keeps the HEAD component key: %o', (filters) => {
        expect(
            hashKey(userCommentListOptions('tester', filters).queryKey),
        ).toBe(
            hashKey(
                componentUserListOptions({ username: 'tester', ...filters })
                    .queryKey,
            ),
        );
    });
});

type Captured = { queryKey: readonly unknown[] };

async function loaderKeys(
    route: { options: { loader?: unknown } },
    args: Record<string, unknown>,
) {
    const keys: Captured['queryKey'][] = [];
    const queryClient = new QueryClient();
    Object.assign(queryClient, {
        ensureQueryData: async () => ({ slug }),
        prefetchQuery: async () => {},
        prefetchInfiniteQuery: async (options: Captured) => {
            keys.push(options.queryKey);
        },
    });

    await (route.options.loader as (ctx: unknown) => Promise<unknown>)({
        ...args,
        context: { queryClient, apiClient: ssrRequestClient() },
    });

    return keys;
}

const PAGE_CASES = [
    { name: 'default', search: {} },
    {
        name: 'review with verdict',
        search: { comment_type: 'review', recommended: 'no' },
    },
    {
        name: 'comment ignores verdict',
        search: { comment_type: 'comment', recommended: 'yes' },
    },
    { name: 'sorted', search: { sort: 'created', order: 'asc' } },
];

describe('comments page loader keys', () => {
    it.each(PAGE_CASES)('match the content list: $name', async ({ search }) => {
        const deps = commentsSearchSchema.parse(search);
        const commentType = deps.comment_type ?? 'all';
        const [key] = await loaderKeys(CommentsRoute, {
            params: { content_type: ContentTypeEnum.ANIME, slug },
            deps,
        });

        expect(hashKey(key)).toBe(
            hashKey(
                componentListOptions({
                    content_type: ContentTypeEnum.ANIME,
                    slug,
                    commentType,
                    verdict:
                        commentType === 'review'
                            ? (deps.recommended ?? null)
                            : null,
                    sort: deps.sort ?? DEFAULT_COMMENT_SORT,
                    order: deps.order ?? DEFAULT_COMMENT_ORDER,
                }).queryKey,
            ),
        );
    });

    it.each([
        { name: 'default', search: {} },
        { name: 'first level only', search: { first_level_only: 'true' } },
        { name: 'first level off', search: { first_level_only: 'false' } },
        {
            name: 'reviews sorted',
            search: { comment_type: 'review', sort: 'created' },
        },
    ])('match the user list: $name', async ({ search }) => {
        const deps = commentsSearchSchema.parse(search);
        const [key] = await loaderKeys(CommentsRoute, {
            params: { content_type: ContentTypeEnum.USER, slug: 'tester' },
            deps,
        });

        expect(hashKey(key)).toBe(
            hashKey(
                componentUserListOptions({
                    username: 'tester',
                    commentType: deps.comment_type ?? 'all',
                    firstLevelOnly: deps.first_level_only,
                    sort: deps.sort ?? DEFAULT_COMMENT_SORT,
                    order: deps.order ?? DEFAULT_COMMENT_ORDER,
                }).queryKey,
            ),
        );
    });

    it('match the edit comments', async () => {
        const [key] = await loaderKeys(EditViewRoute, {
            params: { editId },
        });

        expect(hashKey(key)).toBe(
            hashKey(
                componentListOptions({
                    content_type: ContentTypeEnum.EDIT,
                    slug: editId,
                }).queryKey,
            ),
        );
    });
});

describe('commentThreadOptions', () => {
    const reference = '0d3b8a44-5d69-4f0e-9a3c-2f3e2b1c9d10';

    it('pages the thread at the API maximum', () => {
        expect(THREAD_PAGE_SIZE).toBe(API_LIMITS.pageSize.max);
    });

    it('keeps the thread key', () => {
        expect(commentThreadOptions('x').queryKey).toStrictEqual([
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
        const loaderKey = commentThreadOptions(
            reference,
            ssrRequestClient(),
        ).queryKey;
        const hookKey = commentThreadOptions(reference).queryKey;

        expect(loaderKey).toStrictEqual(hookKey);
        expect(hashKey(loaderKey)).toBe(hashKey(hookKey));
    });
});
