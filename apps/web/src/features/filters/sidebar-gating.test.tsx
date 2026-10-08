import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEBOUNCE_MS } from '@/services/hooks/use-debounce';

import Genre from './genre';
import Studio from './studio';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    visible: false,
    onSearch: undefined as ((keyword: string) => void) | undefined,
    useQuery: vi.fn((_options: unknown) => ({ data: undefined })),
    useInfiniteList: vi.fn((_options: unknown, _extra?: unknown) => ({
        list: undefined,
        isFetching: false,
    })),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-query')>()),
    useQuery: mocks.useQuery,
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: mocks.useInfiniteList,
}));

vi.mock('@/services/hooks/use-visible-once', () => ({
    useVisibleOnce: () => ({ ref: () => {}, visible: mocks.visible }),
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
            onSearch?: (keyword: string) => void;
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
        groupOptions: () => [],
        renderSelectOptions: () => null,
    };
});

const lastQuery = () =>
    mocks.useQuery.mock.calls.at(-1)?.[0] as { enabled?: boolean };

type ListOptions = { queryKey: [{ body: { query?: string } }] };

const lastListBody = () => {
    const options = mocks.useInfiniteList.mock.calls.at(-1)?.[0] as
        | ListOptions
        | undefined;

    return options?.queryKey[0].body;
};

const lastListExtra = () =>
    mocks.useInfiniteList.mock.calls.at(-1)?.[1] as { enabled?: boolean };

let root: ReturnType<typeof createRoot>;

beforeEach(() => {
    vi.useFakeTimers();
    mocks.visible = false;
    mocks.useQuery.mockClear();
    mocks.useInfiniteList.mockClear();
    root = createRoot(document.createElement('div'));
});

afterEach(async () => {
    await act(async () => root.unmount());
    vi.useRealTimers();
});

const render = async (node: ReactNode) => {
    await act(async () => root.render(node));
};

describe('Genre', () => {
    it('does not fetch genres while the sidebar is not visible', async () => {
        await render(<Genre />);

        expect(lastQuery().enabled).toBe(false);
    });

    it('fetches genres once the sidebar is visible', async () => {
        mocks.visible = true;
        await render(<Genre />);

        expect(lastQuery().enabled).toBe(true);
    });
});

describe('Studio', () => {
    it('does not fetch companies while the sidebar is not visible', async () => {
        await render(<Studio />);

        expect(lastListExtra().enabled).toBe(false);
    });

    it('fetches companies once the sidebar is visible', async () => {
        mocks.visible = true;
        await render(<Studio />);

        expect(lastListExtra().enabled).toBe(true);
    });

    it('searches companies only after the typing pauses', async () => {
        mocks.visible = true;
        await render(<Studio />);

        await act(async () => mocks.onSearch?.('bon'));
        await act(async () => mocks.onSearch?.('bone'));

        expect(lastListBody()?.query).toBeUndefined();

        await act(async () => {
            vi.advanceTimersByTime(DEBOUNCE_MS.input);
        });

        expect(lastListBody()?.query).toBe('bone');
    });
});
