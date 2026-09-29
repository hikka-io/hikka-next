import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_LIMITS, searchUsersOptions } from '@hikka/api';

import UserSearchList from './user-search-list';

type QueryOptions = { queryKey: unknown; enabled?: unknown };

const mocks = vi.hoisted(() => ({
    useQuery: vi.fn((_options: unknown) => ({
        data: undefined,
        isFetching: false,
        isRefetching: false,
    })),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-query')>()),
    useQuery: mocks.useQuery,
}));

vi.mock('@/utils/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../components/search-ui', () => {
    const Pass = ({ children }: { children?: ReactNode }) => (
        <div>{children}</div>
    );

    return { SearchList: Pass, SearchGroup: Pass, SearchItem: Pass };
});

const render = (value?: string) =>
    renderToStaticMarkup(<UserSearchList onDismiss={vi.fn()} value={value} />);

const lastOptions = () => mocks.useQuery.mock.calls.at(-1)?.[0] as QueryOptions;

beforeEach(() => {
    mocks.useQuery.mockClear();
});

describe('UserSearchList', () => {
    it('keeps the backend minimum of 3 characters', () => {
        expect(API_LIMITS.userSearchQuery.min).toBe(3);
    });

    it.each([
        ['no value', undefined],
        ['an empty value', ''],
        ['one character', 'a'],
        ['two characters', 'ab'],
    ])('does not search users for %s', (_, value) => {
        render(value);

        expect(lastOptions().enabled).toBe(false);
    });

    it.each([
        ['three characters', 'abc'],
        ['a longer query', 'olexh'],
    ])('searches users for %s', (_, value) => {
        render(value);

        expect(lastOptions().enabled).toBe(true);
    });

    it('sends the typed query unchanged', () => {
        render('abc');

        expect(lastOptions().queryKey).toEqual(
            searchUsersOptions({ body: { query: 'abc' } }).queryKey,
        );
    });

    it('keeps the start hint for a query below the minimum', () => {
        expect(render('ab')).toContain('Введіть назву, щоб розпочати пошук...');
    });
});
