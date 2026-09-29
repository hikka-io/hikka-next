import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useClearFilters } from './use-clear-filters';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const navigate = vi.hoisted(() => vi.fn());

vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => navigate,
}));

type NavigateOptions = {
    to: string;
    replace: boolean;
    search: (prev: Record<string, unknown>) => Record<string, unknown>;
};

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    navigate.mockReset();
});

function Harness({
    preserve,
    onRender,
}: {
    preserve: readonly string[];
    onRender: (clear: () => void) => void;
}) {
    onRender(useClearFilters({ preserve }));
    return null;
}

async function clearWith(preserve: readonly string[]) {
    let clear: () => void = () => {};
    const root = createRoot(document.createElement('div'));
    teardown.push(() => root.unmount());

    await act(async () => {
        root.render(
            <Harness
                preserve={preserve}
                onRender={(next) => {
                    clear = next;
                }}
            />,
        );
    });

    clear();

    expect(navigate).toHaveBeenCalledTimes(1);
    return navigate.mock.calls[0][0] as NavigateOptions;
}

const PREV = {
    page: 3,
    genres: ['action', '-drama'],
    score: [7, 10],
    date_range_enabled: true,
    tab: 'manga',
    order: 'asc',
    sort: 'score',
    search: 'naruto',
};

describe('useClearFilters', () => {
    it('replaces the current route', async () => {
        const options = await clearWith([]);

        expect(options.to).toBe('.');
        expect(options.replace).toBe(true);
    });

    it('drops every param when nothing is preserved', async () => {
        const { search } = await clearWith([]);

        expect(search(PREV)).toEqual({});
    });

    it('keeps the text query, sort, order and tab for the active filters', async () => {
        const { search } = await clearWith(['search', 'sort', 'order', 'tab']);
        const next = search(PREV);

        expect(next).toEqual({
            search: 'naruto',
            sort: 'score',
            order: 'asc',
            tab: 'manga',
        });
        expect(Object.keys(next)).toEqual(['search', 'sort', 'order', 'tab']);
    });

    it('keeps the text query, sort and order for the filters footer', async () => {
        const { search } = await clearWith(['search', 'sort', 'order']);
        const next = search(PREV);

        expect(next).toEqual({
            search: 'naruto',
            sort: 'score',
            order: 'asc',
        });
        expect(Object.keys(next)).toEqual(['search', 'sort', 'order']);
    });

    it('keeps only the tab for the todo lists', async () => {
        const { search } = await clearWith(['tab']);

        expect(search(PREV)).toEqual({ tab: 'manga' });
    });

    it('skips preserved params that are missing or empty', async () => {
        const { search } = await clearWith(['search', 'sort', 'order', 'tab']);

        expect(
            search({ search: '', sort: undefined, genres: ['action'] }),
        ).toEqual({});
    });
});
