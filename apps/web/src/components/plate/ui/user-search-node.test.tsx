import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import type { PlateElementProps } from 'platejs/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { searchUsersOptions } from '@hikka/api';

import { DEBOUNCE_MS } from '@/services/hooks/use-debounce';

import { UserSearchInputElement } from './user-search-node';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type QueryOptions = { queryKey: unknown; enabled?: unknown };

const mocks = vi.hoisted(() => ({
    setValue: undefined as ((value: string) => void) | undefined,
    useQuery: vi.fn((_options: unknown) => ({
        data: undefined,
        isFetching: false,
    })),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-query')>()),
    useQuery: mocks.useQuery,
}));

vi.mock('platejs/react', async (importOriginal) => ({
    ...(await importOriginal<typeof import('platejs/react')>()),
    PlateElement: ({ children }: { children?: ReactNode }) => (
        <span>{children}</span>
    ),
}));

vi.mock('../editor/transforms', () => ({ insertMentionLink: vi.fn() }));

vi.mock('./inline-combobox', () => {
    const Pass = ({ children }: { children?: ReactNode }) => (
        <div>{children}</div>
    );

    return {
        InlineCombobox: ({
            children,
            setValue,
        }: {
            children?: ReactNode;
            setValue: (value: string) => void;
        }) => {
            mocks.setValue = setValue;
            return <div>{children}</div>;
        },
        InlineComboboxContent: Pass,
        InlineComboboxEmpty: ({ children }: { children?: ReactNode }) => (
            <div data-empty="">{children}</div>
        ),
        InlineComboboxGroup: Pass,
        InlineComboboxInput: () => null,
        InlineComboboxItem: Pass,
    };
});

const teardown: (() => void)[] = [];

beforeEach(() => {
    vi.useFakeTimers();
    mocks.useQuery.mockClear();
});

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.useRealTimers();
});

async function mount() {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const props = {
        children: null,
        editor: {},
        element: {},
    } as unknown as PlateElementProps;

    await act(async () => root.render(<UserSearchInputElement {...props} />));
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const search = async (value: string) => {
        await act(async () => mocks.setValue?.(value));
        await act(async () => vi.advanceTimersByTime(DEBOUNCE_MS.input));
    };

    const lastOptions = () =>
        mocks.useQuery.mock.calls.at(-1)?.[0] as QueryOptions;

    const emptyText = () =>
        container.querySelector('[data-empty]')?.textContent ?? '';

    return { search, lastOptions, emptyText };
}

describe('UserSearchInputElement', () => {
    it.each([
        ['nothing typed', ''],
        ['one character', 'a'],
        ['two characters', 'ab'],
        ['two characters after a space', ' ab'],
        ['two characters padded with spaces', ' ab '],
    ])('does not search users for %s', async (_, value) => {
        const { search, lastOptions, emptyText } = await mount();

        await search(value);

        expect(lastOptions().enabled).toBe(false);
        expect(emptyText()).toBe('Введіть щонайменше 3 символи');
    });

    it.each([
        'abc',
        '  abc',
    ])('searches users from three characters in %j', async (value) => {
        const { search, lastOptions, emptyText } = await mount();

        await search(value);

        expect(lastOptions().enabled).toBe(true);
        expect(lastOptions().queryKey).toEqual(
            searchUsersOptions({ body: { query: value } }).queryKey,
        );
        expect(emptyText()).toBe('Користувачів не знайдено');
    });

    it('waits for the debounce before searching', async () => {
        const { lastOptions, emptyText } = await mount();

        await act(async () => mocks.setValue?.('abc'));

        expect(lastOptions().enabled).toBe(false);
        expect(emptyText()).toBe('Введіть щонайменше 3 символи');
    });
});
