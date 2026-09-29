import { renderToStaticMarkup } from 'react-dom/server';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import {
    contentInfoOptions,
    listEntryOptions,
} from '@/utils/api/content-queries';

import ContentActions from './actions';

type QueryOptions = { queryKey: unknown; enabled?: unknown };

const SLUG = 'some-slug';

const mocks = vi.hoisted(() => ({
    user: undefined as { username: string } | undefined,
    useQuery: vi.fn((_options: unknown) => ({
        data: undefined,
        isError: false,
    })),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-query')>()),
    useQuery: mocks.useQuery,
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: mocks.user }),
}));

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ slug: SLUG }),
}));

vi.mock('@/components/action-buttons', () => ({
    FavoriteButton: () => null,
}));

vi.mock('../list-entry-button', () => ({ default: () => null }));

vi.mock('./components/user-content-stats', () => ({ default: () => null }));

const queryOptionsWithKey = (queryKey: unknown) =>
    mocks.useQuery.mock.calls
        .map(([options]) => options as QueryOptions)
        .filter(
            (options) =>
                JSON.stringify(options.queryKey) === JSON.stringify(queryKey),
        );

beforeEach(() => {
    mocks.useQuery.mockClear();
    mocks.user = undefined;
});

describe.each([
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
] as const)('ContentActions (%s)', (type: MainContentTypeEnum) => {
    const render = () =>
        renderToStaticMarkup(<ContentActions content_type={type} />);

    it('does not enable the list-entry query for a logged-out visitor', () => {
        render();

        const [options] = queryOptionsWithKey(
            listEntryOptions(type, SLUG).queryKey,
        );
        expect(options.enabled).toBe(false);
    });

    it('enables the list-entry query for a logged-in user', () => {
        mocks.user = { username: 'someone' };
        render();

        const [options] = queryOptionsWithKey(
            listEntryOptions(type, SLUG).queryKey,
        );
        expect(options.enabled).toBe(true);
    });

    it('keeps the list-entry query key and leaves the content query ungated', () => {
        render();

        expect(
            queryOptionsWithKey(listEntryOptions(type, SLUG).queryKey),
        ).toHaveLength(1);

        const content = queryOptionsWithKey(
            contentInfoOptions(type, SLUG).queryKey,
        );
        expect(content).toHaveLength(1);
        expect(content[0]).not.toHaveProperty('enabled');
    });
});
