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
    calls: [] as unknown[][],
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: mocks.user }),
}));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ slug: SLUG }),
}));

vi.mock('@/services/hooks/use-close-on-route-change', () => ({
    useCloseOnRouteChange: () => {},
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (...args: unknown[]) => {
        mocks.calls.push(args);
        return { list: undefined };
    },
}));

const watchKey = () =>
    getWatchFollowingInfiniteOptions({ path: { slug: SLUG } }).queryKey;

const readKey = (type: MainContentTypeEnum) =>
    getReadFollowingInfiniteOptions({
        path: { slug: SLUG, content_type: type as ReadContentTypeEnum },
    }).queryKey;

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
        render();

        expect(enabledFor(watchKey())).toBe(false);
        expect(enabledFor(readKey(type))).toBe(false);
    });

    it('enables only the query for its content type when logged in', () => {
        mocks.user = { username: 'someone' };
        render();

        expect(enabledFor(watchKey())).toBe(isAnime);
        expect(enabledFor(readKey(type))).toBe(!isAnime);
    });

    it('keeps both following query keys', () => {
        render();

        expect(mocks.calls).toHaveLength(2);
        expect(callsWithKey(watchKey())).toHaveLength(1);
        expect(callsWithKey(readKey(type))).toHaveLength(1);
    });
});
