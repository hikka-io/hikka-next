import { renderToStaticMarkup } from 'react-dom/server';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    getReadFollowingInfiniteOptions,
    getWatchFollowingInfiniteOptions,
    type MainContentTypeEnum,
    type ReadContentTypeEnum,
} from '@hikka/api';

import { contentFollowingOptions } from '../queries';
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

const headPreviewKey = (type: MainContentTypeEnum) =>
    type === ContentTypeEnum.ANIME
        ? getWatchFollowingInfiniteOptions({
              path: { slug: SLUG },
              query: PREVIEW_QUERY,
          }).queryKey
        : getReadFollowingInfiniteOptions({
              path: { slug: SLUG, content_type: type as ReadContentTypeEnum },
              query: PREVIEW_QUERY,
          }).queryKey;

const withoutQuery = (queryKey: unknown) => {
    const [{ query: _query, ...rest }] = queryKey as [{ query?: unknown }];
    return rest;
};

const onlyCall = () => {
    const calls = mocks.calls as ListCall[];
    expect(calls).toHaveLength(1);
    return calls[0];
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
    const render = () =>
        renderToStaticMarkup(<Followings content_type={type} />);

    it('disables the preview for a logged-out visitor', () => {
        mocks.visible = true;
        render();

        expect(onlyCall()[1]).toEqual({ enabled: false });
    });

    it('disables the preview until the block is visible', () => {
        mocks.user = { username: 'someone' };
        render();

        expect(onlyCall()[1]).toEqual({ enabled: false });
    });

    it('enables one preview query when logged in and visible', () => {
        mocks.user = { username: 'someone' };
        mocks.visible = true;
        render();

        expect(onlyCall()[1]).toEqual({ enabled: true });
    });

    it('keeps the HEAD preview key for its content type', () => {
        render();

        const [options] = onlyCall();
        expect(options.queryKey).toEqual(headPreviewKey(type));
        expect(options.queryKey).toEqual(
            contentFollowingOptions(type, SLUG, { preview: true }).queryKey,
        );
    });

    it('keys the preview by the modal key plus a size of 3', () => {
        render();

        const [options] = onlyCall();
        const modalKey = contentFollowingOptions(type, SLUG).queryKey;

        expect(options.queryKey).not.toEqual(modalKey);
        expect(withoutQuery(options.queryKey)).toEqual(withoutQuery(modalKey));
        expect((options.queryKey as [{ query: unknown }])[0].query).toEqual(
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
