import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { API_LIMITS, searchUsersOptions } from '@hikka/api';

import UserFilter from './user';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type QueryOptions = { queryKey: unknown; enabled?: unknown };

const mocks = vi.hoisted(() => ({
    onSearch: undefined as ((keyword: string) => void) | undefined,
    useQuery: vi.fn((_options: unknown) => ({
        data: undefined,
        isFetching: false,
    })),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-query')>()),
    useQuery: mocks.useQuery,
}));

vi.mock('@/utils/navigation', () => ({ useRouteSearch: () => ({}) }));

vi.mock('./use-change-param', () => ({ useChangeParam: () => vi.fn() }));

vi.mock('@/components/ui/select', () => {
    const Pass = ({ children }: { children?: ReactNode }) => (
        <div>{children}</div>
    );

    return {
        Select: ({
            children,
            onSearch,
        }: {
            children?: ReactNode;
            onSearch: (keyword: string) => void;
        }) => {
            mocks.onSearch = onSearch;

            return <div>{children}</div>;
        },
        SelectContent: Pass,
        SelectEmpty: Pass,
        SelectGroup: Pass,
        SelectItem: Pass,
        SelectList: Pass,
        SelectSearch: () => null,
        SelectTrigger: Pass,
        SelectValue: () => null,
    };
});

const lastOptions = () => mocks.useQuery.mock.calls.at(-1)?.[0] as QueryOptions;

let root: ReturnType<typeof createRoot> | undefined;

beforeEach(async () => {
    mocks.useQuery.mockClear();
    root = createRoot(document.createElement('div'));
    await act(async () => {
        root?.render(<UserFilter paramKey="author" title="Автор" />);
    });
});

afterEach(async () => {
    await act(async () => root?.unmount());
});

const search = async (keyword: string) => {
    await act(async () => mocks.onSearch?.(keyword));
};

describe('UserFilter', () => {
    it('keeps the backend minimum of 3 characters', () => {
        expect(API_LIMITS.userSearchQuery.min).toBe(3);
    });

    it('does not search before a keyword is typed', () => {
        expect(lastOptions().enabled).toBe(false);
    });

    it.each([
        ['two characters', 'ab'],
        ['two characters after a space', ' ab'],
        ['two characters padded with spaces', '  ab  '],
    ])('does not search users for %s', async (_, keyword) => {
        await search('abc');
        await search(keyword);

        expect(lastOptions().enabled).toBe(false);
    });

    it.each([
        ['three characters', 'abc'],
        ['three characters after spaces', '  abc'],
    ])('searches users for %s with the typed query', async (_, keyword) => {
        await search(keyword);

        expect(lastOptions().enabled).toBe(true);
        expect(lastOptions().queryKey).toEqual(
            searchUsersOptions({ body: { query: keyword } }).queryKey,
        );
    });
});
