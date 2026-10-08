import { renderToStaticMarkup } from 'react-dom/server';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    configureBrowserClient,
    followingHistoryInfiniteOptions,
    userHistoryInfiniteOptions,
} from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

import HistoryFeed from './history-feed';

const mocks = vi.hoisted(() => ({
    state: {
        list: undefined as unknown[] | undefined,
        hasNextPage: false,
        isPending: false,
    },
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: vi.fn(() => ({
        list: mocks.state.list,
        fetchNextPage: () => {},
        hasNextPage: mocks.state.hasNextPage,
        isFetchingNextPage: false,
        isPending: mocks.state.isPending,
        ref: () => {},
    })),
}));
vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useParams: () => ({ username: 'emp_ua' }),
}));
vi.mock('@/components/list-items', () => {
    const Stub = (name: string) => (props: Record<string, unknown>) => (
        <div data-stub={name}>
            {Object.entries(props).map(([key, value]) => (
                <div key={key} data-prop={key}>
                    {JSON.stringify(value)}
                </div>
            ))}
        </div>
    );

    return {
        HistoryTimeline: Stub('history-timeline'),
        HistoryTimelineSkeleton: Stub('history-timeline-skeleton'),
    };
});

const OPTIONS = {
    user: () => userHistoryInfiniteOptions({ path: { username: 'emp_ua' } }),
    following: () => followingHistoryInfiniteOptions(),
};

const ITEMS = [1, 2, 3].map((i) => ({ reference: `ref-${i}`, created: i }));

const prop = (markup: string, name: string) =>
    markup.match(new RegExp(`data-prop="${name}">([^<]*)<`))?.[1];

beforeAll(() => {
    configureBrowserClient({ baseUrl: 'https://api.example.test' });
});

beforeEach(() => {
    vi.mocked(useInfiniteList).mockClear();
    Object.assign(mocks.state, {
        list: undefined,
        hasNextPage: false,
        isPending: false,
    });
});

describe.each(['user', 'following'] as const)('HistoryFeed(%s)', (source) => {
    it('passes the source query options', () => {
        renderToStaticMarkup(<HistoryFeed source={source} />);

        const [[options, extra]] = vi.mocked(useInfiniteList).mock.calls;

        expect(options.queryKey).toEqual(OPTIONS[source]().queryKey);
        expect(extra).toBeUndefined();
    });

    it('renders the large skeleton while the first page loads', () => {
        mocks.state.isPending = true;

        const markup = renderToStaticMarkup(<HistoryFeed source={source} />);

        expect(markup).toContain('data-stub="history-timeline-skeleton"');
        expect(prop(markup, 'size')).toBe('&quot;lg&quot;');
        expect(prop(markup, 'count')).toBe('15');
        expect(markup).not.toContain('data-stub="history-timeline"');
    });

    it('renders the large timeline for a loaded list', () => {
        mocks.state.list = ITEMS;

        const markup = renderToStaticMarkup(<HistoryFeed source={source} />);

        expect(markup).toContain('data-stub="history-timeline"');
        expect(markup).not.toContain('history-timeline-skeleton');
        expect(prop(markup, 'size')).toBe('&quot;lg&quot;');
        expect(prop(markup, 'withUser')).toBe(String(source === 'following'));
        expect(
            JSON.parse((prop(markup, 'items') ?? '').replaceAll('&quot;', '"')),
        ).toHaveLength(3);
    });

    it('renders the empty state for an empty list', () => {
        mocks.state.list = [];

        const markup = renderToStaticMarkup(<HistoryFeed source={source} />);

        expect(markup).toContain('Історія відсутня');
        expect(markup).not.toContain('data-stub="history-timeline"');
    });

    it('renders the load more button only when another page exists', () => {
        mocks.state.list = ITEMS;

        mocks.state.hasNextPage = true;
        expect(renderToStaticMarkup(<HistoryFeed source={source} />)).toContain(
            'Показати ще',
        );

        mocks.state.hasNextPage = false;
        expect(
            renderToStaticMarkup(<HistoryFeed source={source} />),
        ).not.toContain('Показати ще');
    });
});
