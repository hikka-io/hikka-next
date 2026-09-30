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
const ENTRY = { reference: 'entry', status: 'watching' };

const mocks = vi.hoisted(() => ({
    user: undefined as { username: string } | undefined,
    useQuery: vi.fn((_options: unknown) => ({
        data: undefined as unknown,
        isError: false,
    })),
    statsProps: [] as Record<string, unknown>[],
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

vi.mock('./components/user-content-stats', () => ({
    default: (props: Record<string, unknown>) => {
        mocks.statsProps.push(props);
        return null;
    },
}));

const queryOptionsWithKey = (queryKey: unknown) =>
    mocks.useQuery.mock.calls
        .map(([options]) => options as QueryOptions)
        .filter(
            (options) =>
                JSON.stringify(options.queryKey) === JSON.stringify(queryKey),
        );

beforeEach(() => {
    mocks.useQuery.mockClear();
    mocks.useQuery.mockImplementation(() => ({
        data: undefined,
        isError: false,
    }));
    mocks.user = undefined;
    mocks.statsProps.length = 0;
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

    it.each([
        ['a loaded entry', ENTRY, false, ENTRY],
        ['a kept entry after a failed refetch', ENTRY, true, ENTRY],
        ['a failed fetch', undefined, true, undefined],
        ['a null entry', null, false, undefined],
    ])('passes the stats %s', (_name, data, isError, listItem) => {
        mocks.user = { username: 'someone' };
        const entryKey = JSON.stringify(listEntryOptions(type, SLUG).queryKey);
        mocks.useQuery.mockImplementation((options) =>
            JSON.stringify((options as QueryOptions).queryKey) === entryKey
                ? { data, isError }
                : { data: undefined, isError: false },
        );
        render();

        expect(mocks.statsProps.at(-1)?.listItem).toBe(listItem);
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
