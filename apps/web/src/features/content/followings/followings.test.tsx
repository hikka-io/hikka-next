import { renderToStaticMarkup } from 'react-dom/server';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    getReadFollowingInfiniteOptions,
    getWatchFollowingInfiniteOptions,
    type MainContentTypeEnum,
    type ReadContentTypeEnum,
} from '@hikka/api';

import Followings from './followings';

type ListCall = [{ queryKey: unknown }, { enabled?: boolean } | undefined];

const SLUG = 'some-slug';

const mocks = vi.hoisted(() => ({
    user: undefined as { username: string } | undefined,
    visible: false,
    calls: [] as unknown[][],
    result: { list: undefined } as Record<string, unknown>,
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: mocks.user }),
}));

vi.mock('@/services/hooks/use-visible-once', () => ({
    useVisibleOnce: () => ({ ref: () => {}, visible: mocks.visible }),
}));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ slug: SLUG }),
}));

vi.mock('@/services/hooks/use-close-on-route-change', () => ({
    useCloseOnRouteChange: () => {},
}));

vi.mock('./components/following-item', () => ({
    default: () => null,
}));

vi.mock('@/components/ui/responsive-modal', () => ({
    ResponsiveModal: () => null,
    ResponsiveModalContent: () => null,
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (...args: unknown[]) => {
        mocks.calls.push(args);
        return mocks.result;
    },
}));

const PREVIEW_QUERY = { size: 3 };

const watchKey = () =>
    getWatchFollowingInfiniteOptions({
        path: { slug: SLUG },
        query: PREVIEW_QUERY,
    }).queryKey;

const readKey = (type: MainContentTypeEnum) =>
    getReadFollowingInfiniteOptions({
        path: { slug: SLUG, content_type: type as ReadContentTypeEnum },
        query: PREVIEW_QUERY,
    }).queryKey;

const withoutQuery = (queryKey: unknown) => {
    const [{ query: _query, ...rest }] = queryKey as [{ query?: unknown }];
    return rest;
};

const callsWithKey = (queryKey: unknown) =>
    (mocks.calls as ListCall[]).filter(
        ([options]) =>
            JSON.stringify(options.queryKey) === JSON.stringify(queryKey),
    );

const enabledFor = (queryKey: unknown) => {
    const calls = callsWithKey(queryKey);
    expect(calls).toHaveLength(1);
    return calls[0][1]?.enabled;
};

beforeEach(() => {
    mocks.calls = [];
    mocks.user = undefined;
    mocks.visible = false;
    mocks.result = { list: undefined };
});

describe.each([
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
] as const)('Followings (%s)', (type: MainContentTypeEnum) => {
    const isAnime = type === ContentTypeEnum.ANIME;
    const render = () =>
        renderToStaticMarkup(<Followings content_type={type} />);

    it('enables neither following query for a logged-out visitor', () => {
        mocks.visible = true;
        render();

        expect(enabledFor(watchKey())).toBe(false);
        expect(enabledFor(readKey(type))).toBe(false);
    });

    it('enables neither following query until the block is visible', () => {
        mocks.user = { username: 'someone' };
        render();

        expect(enabledFor(watchKey())).toBe(false);
        expect(enabledFor(readKey(type))).toBe(false);
    });

    it('enables only the query for its content type when logged in and visible', () => {
        mocks.user = { username: 'someone' };
        mocks.visible = true;
        render();

        expect(enabledFor(watchKey())).toBe(isAnime);
        expect(enabledFor(readKey(type))).toBe(!isAnime);
    });

    it('keys the previews by the modal key plus a size of 3', () => {
        render();

        const [[watch], [read]] = mocks.calls as ListCall[];
        const modalWatch = getWatchFollowingInfiniteOptions({
            path: { slug: SLUG },
        }).queryKey;
        const modalRead = getReadFollowingInfiniteOptions({
            path: { slug: SLUG, content_type: type as ReadContentTypeEnum },
        }).queryKey;

        expect(watch.queryKey).not.toEqual(modalWatch);
        expect(read.queryKey).not.toEqual(modalRead);
        expect(withoutQuery(watch.queryKey)).toEqual(withoutQuery(modalWatch));
        expect(withoutQuery(read.queryKey)).toEqual(withoutQuery(modalRead));
        expect((watch.queryKey as [{ query: unknown }])[0].query).toEqual(
            PREVIEW_QUERY,
        );
    });

    it('titles the preview with the total count, not the preview length', () => {
        mocks.user = { username: 'someone' };
        mocks.visible = true;
        mocks.result = {
            list: [{ reference: 'a' }, { reference: 'b' }, { reference: 'c' }],
            pagination: { total: 42, pages: 14, page: 1 },
            isPending: false,
        };

        expect(render()).toContain('(42)');
    });
});
