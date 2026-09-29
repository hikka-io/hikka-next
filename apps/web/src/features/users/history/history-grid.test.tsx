import { Fragment, isValidElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    configureBrowserClient,
    followingHistoryInfiniteOptions,
    type HistoryResponse,
    userHistoryInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import { HistoryItem } from '@/components/list-items';
import LoadMoreButton from '@/components/load-more-button';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import Stack from '@/components/ui/stack';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import HistoryGrid from './history-grid';

const mocks = vi.hoisted(() => ({
    state: {
        list: undefined as unknown[] | undefined,
        hasNextPage: false,
    },
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: vi.fn(() => ({
        list: mocks.state.list,
        fetchNextPage: () => {},
        hasNextPage: mocks.state.hasNextPage,
        isFetchingNextPage: false,
        ref: () => {},
    })),
}));
vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useParams: () => ({ username: 'emp_ua' }),
}));
vi.mock('@/components/list-items', () => ({
    HistoryItem: (props: Record<string, unknown>) => (
        <div data-stub="history-item">
            {Object.entries(props).map(([key, value]) => (
                <div key={key} data-prop={key}>
                    {isValidElement(value) ? value : JSON.stringify(value)}
                </div>
            ))}
        </div>
    ),
}));

const LEGACY = {
    user: {
        options: (params: Record<string, string>) =>
            userHistoryInfiniteOptions({
                path: { username: String(params.username) },
            }),
        item: (item: HistoryResponse) => <HistoryItem data={item} />,
    },
    following: {
        options: () => followingHistoryInfiniteOptions(),
        item: (item: HistoryResponse) => (
            <HistoryItem data={item} withUser className="flex-1" />
        ),
    },
};

const LegacyHistory = ({ source }: { source: keyof typeof LEGACY }) => {
    const params = useParams();
    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useInfiniteList(LEGACY[source].options(params));

    return (
        <Fragment>
            <Stack
                size={3}
                extended
                extendedSize={3}
                className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
                {list?.map((item, index) => (
                    <Card key={item.reference}>
                        <Badge
                            variant="secondary"
                            className="absolute -top-3 left-4 z-1"
                        >
                            #{index + 1}
                        </Badge>
                        {LEGACY[source].item(item)}
                    </Card>
                ))}
                {list?.length === 0 && (
                    <EmptyState
                        icon={<MaterialSymbolsHistoryRounded />}
                        title="Історія відсутня"
                        description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                    />
                )}
            </Stack>
            {list && hasNextPage && (
                <LoadMoreButton
                    ref={ref}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
            )}
        </Fragment>
    );
};

const CASES = {
    missing: { list: undefined, hasNextPage: false },
    empty: { list: [], hasNextPage: false },
    paged: {
        list: [1, 2, 3].map((i) => ({ reference: `ref-${i}`, created: i })),
        hasNextPage: true,
    },
};

const html = (node: ReactNode) => renderToStaticMarkup(node);

beforeAll(() => {
    configureBrowserClient({ baseUrl: 'https://api.example.test' });
});

beforeEach(() => {
    vi.mocked(useInfiniteList).mockClear();
});

describe.each(['user', 'following'] as const)('HistoryGrid(%s)', (source) => {
    it.each(
        Object.entries(CASES),
    )('renders the legacy markup for a %s list', (_, state) => {
        Object.assign(mocks.state, state);

        expect(html(<HistoryGrid source={source} />)).toBe(
            html(<LegacyHistory source={source} />),
        );
    });

    it('passes the legacy query options', () => {
        html(<HistoryGrid source={source} />);
        html(<LegacyHistory source={source} />);

        const [[options, extra], [legacyOptions, legacyExtra]] =
            vi.mocked(useInfiniteList).mock.calls;

        expect(options.queryKey).toEqual(legacyOptions.queryKey);
        expect(Object.keys(options)).toEqual(Object.keys(legacyOptions));
        expect(extra).toBeUndefined();
        expect(legacyExtra).toBeUndefined();
    });
});
