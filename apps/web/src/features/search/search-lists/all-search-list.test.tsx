import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    API_LIMITS,
    searchAnimeInfiniteOptions,
    searchCharactersInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
    searchPeopleInfiniteOptions,
} from '@hikka/api';

import AllSearchList from './all-search-list';

type ListOptions = { queryKey: unknown };

const mocks = vi.hoisted(() => ({
    useInfiniteList: vi.fn(
        (_options: unknown, _extra?: { enabled?: boolean }) => ({
            list: undefined,
            isFetching: false,
            isRefetching: false,
            fetchNextPage: vi.fn(),
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

const SEARCHES = [
    searchAnimeInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
    searchCharactersInfiniteOptions,
    searchPeopleInfiniteOptions,
];

const render = (value?: string) =>
    renderToStaticMarkup(
        <AllSearchList
            onDismiss={vi.fn()}
            onClose={vi.fn()}
            onSwitchType={vi.fn()}
            value={value}
        />,
    );

const calls = () => mocks.useInfiniteList.mock.calls;

beforeEach(() => {
    mocks.useInfiniteList.mockClear();
});

describe('AllSearchList', () => {
    it('keeps the backend minimum of 2 characters', () => {
        expect(API_LIMITS.searchQuery.min).toBe(2);
    });

    it.each([
        ['no value', undefined],
        ['an empty value', ''],
        ['one character', 'a'],
        ['one character after a space', ' a'],
        ['one character padded with spaces', '  a  '],
    ])('does not search any type for %s', (_, value) => {
        render(value);

        expect(calls().map(([, extra]) => extra?.enabled)).toEqual(
            SEARCHES.map(() => false),
        );
    });

    it.each([
        ['two characters', 'ab'],
        ['two characters after spaces', '  ab'],
    ])('searches every type for %s', (_, value) => {
        render(value);

        expect(calls().map(([, extra]) => extra?.enabled)).toEqual(
            SEARCHES.map(() => true),
        );
    });

    it.each(['ab', '  ab'])('sends the typed query %j unchanged', (value) => {
        render(value);

        expect(
            calls().map(([options]) => (options as ListOptions).queryKey),
        ).toEqual(
            SEARCHES.map(
                (search) =>
                    search({ body: { query: value }, query: { size: 3 } })
                        .queryKey,
            ),
        );
    });
});
