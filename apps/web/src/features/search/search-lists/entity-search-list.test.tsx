import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_LIMITS, searchAnimeInfiniteOptions } from '@hikka/api';

import EntitySearchList from './entity-search-list';

type ListOptions = { queryKey: unknown };

const mocks = vi.hoisted(() => ({
    useInfiniteList: vi.fn(
        (_options: unknown, _extra?: { enabled?: boolean }) => ({
            list: undefined,
            isFetching: false,
            isRefetching: false,
            ref: vi.fn(),
            fetchNextPage: vi.fn(),
            isFetchingNextPage: false,
            hasNextPage: false,
        }),
    ),
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: mocks.useInfiniteList,
}));

vi.mock('@/utils/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../search-history-store', () => ({
    useSearchHistoryStore: (
        select: (state: { addEntry: () => void }) => unknown,
    ) => select({ addEntry: vi.fn() }),
}));

vi.mock('../components/search-ui', () => {
    const Pass = ({ children }: { children?: ReactNode }) => (
        <div>{children}</div>
    );

    return { SearchList: Pass, SearchGroup: Pass, SearchItem: Pass };
});

vi.mock('../components/search-placeholders', () => ({ default: () => null }));

const render = (value?: string) =>
    renderToStaticMarkup(
        <EntitySearchList
            contentType="anime"
            onDismiss={vi.fn()}
            onClose={vi.fn()}
            value={value}
        />,
    );

const lastCall = () => mocks.useInfiniteList.mock.calls.at(-1);

beforeEach(() => {
    mocks.useInfiniteList.mockClear();
});

describe('EntitySearchList', () => {
    it('keeps the backend minimum of 2 characters', () => {
        expect(API_LIMITS.searchQuery.min).toBe(2);
    });

    it.each([
        ['no value', undefined],
        ['an empty value', ''],
        ['one character', 'a'],
        ['one character after a space', ' a'],
        ['one character padded with spaces', '  a  '],
    ])('does not search for %s', (_, value) => {
        render(value);

        expect(lastCall()?.[1]?.enabled).toBe(false);
    });

    it.each([
        ['two characters', 'ab'],
        ['two characters after spaces', '  ab'],
    ])('searches for %s', (_, value) => {
        render(value);

        expect(lastCall()?.[1]?.enabled).toBe(true);
    });

    it.each(['ab', '  ab'])('sends the typed query %j unchanged', (value) => {
        render(value);

        expect((lastCall()?.[0] as ListOptions).queryKey).toEqual(
            searchAnimeInfiniteOptions({
                body: { query: value },
                query: { size: 30 },
            }).queryKey,
        );
    });
});
