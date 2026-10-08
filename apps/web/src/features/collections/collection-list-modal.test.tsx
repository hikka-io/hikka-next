import type { FC, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';

import { range } from '@antfu/utils';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    type CollectionResponse,
    type CollectionsListArgs,
    ContentTypeEnum,
    configureBrowserClient,
    getCollectionsInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import {
    CollectionItem,
    CollectionItemSkeleton,
} from '@/components/list-items';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import CollectionListModal from './collection-list-modal';

const state = vi.hoisted(() => ({
    list: undefined as unknown[] | undefined,
    isLoading: false,
    hasNextPage: false,
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: vi.fn(() => ({
        ...state,
        isFetchingNextPage: false,
        fetchNextPage: () => {},
        ref: () => {},
    })),
}));
vi.mock('@/components/list-items', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    CollectionItem: ({ data }: { data: CollectionResponse }) => (
        <div data-collection={data.reference}>{data.title}</div>
    ),
}));
vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useParams: () => ({ slug: 'bakemonogatari-114ac3', username: 'emp_ua' }),
}));

const SKELETON_COUNT = 5;

type Variant = 'content' | 'author';

const VARIANTS: Record<
    Variant,
    {
        body: CollectionsListArgs;
        icon: ReactNode;
        title: string;
        description: string;
    }
> = {
    content: {
        body: {
            content_type: ContentTypeEnum.ANIME,
            content: ['bakemonogatari-114ac3'],
        },
        icon: <MaterialSymbolsStack />,
        title: 'Колекцій не знайдено',
        description: 'Цей тайтл ще не додано до жодної колекції',
    },
    author: {
        body: {
            author: 'emp_ua',
            sort: ['created:desc'],
            only_public: false,
        },
        icon: <MaterialSymbolsGridViewRounded />,
        title: 'Колекції відсутні',
        description: 'Тут з’являться колекції цього користувача',
    },
};

const LegacyCollectionsModal: FC<{ variant: Variant }> = ({ variant }) => {
    const params = useParams();
    const { icon, title, description } = VARIANTS[variant];

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchNextPage,
        ref,
    } = useInfiniteList(
        getCollectionsInfiniteOptions({
            body:
                variant === 'content'
                    ? {
                          content_type: ContentTypeEnum.ANIME,
                          content: [String(params.slug)],
                      }
                    : {
                          author: String(params.username),
                          sort: ['created:desc'],
                          only_public: false,
                      },
        }),
    );

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {isLoading &&
                range(0, SKELETON_COUNT).map((index) => (
                    <CollectionItemSkeleton key={index} />
                ))}
            {list?.map((collection) => (
                <CollectionItem data={collection} key={collection.reference} />
            ))}
            {!isLoading && list?.length === 0 && (
                <EmptyState
                    icon={icon}
                    title={title}
                    description={description}
                />
            )}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </div>
    );
};

const collection = (index: number) =>
    ({
        reference: `ref-${index}`,
        title: `Collection ${index}`,
    }) as CollectionResponse;

const CASES = {
    loading: { list: undefined, isLoading: true, hasNextPage: false },
    list: {
        list: [collection(1), collection(2)],
        isLoading: false,
        hasNextPage: true,
    },
    empty: { list: [], isLoading: false, hasNextPage: false },
};

beforeAll(() => {
    configureBrowserClient({ baseUrl: 'https://api.example.test' });
});

beforeEach(() => {
    vi.mocked(useInfiniteList).mockClear();
});

describe.each(Object.keys(VARIANTS) as Variant[])(
    'CollectionListModal(%s)',
    (variant) => {
        const { body, icon, title, description } = VARIANTS[variant];
        const modal = () => (
            <CollectionListModal
                options={getCollectionsInfiniteOptions({ body })}
                emptyState={
                    <EmptyState
                        icon={icon}
                        title={title}
                        description={description}
                    />
                }
            />
        );

        it.each(Object.entries(CASES))(
            'renders the legacy markup when %s',
            (_, next) => {
                Object.assign(state, next);

                expect(renderToString(modal())).toBe(
                    renderToString(
                        <LegacyCollectionsModal variant={variant} />,
                    ),
                );
            },
        );

        it('keeps the legacy query key', () => {
            renderToString(modal());
            renderToString(<LegacyCollectionsModal variant={variant} />);

            const [[options], [legacy]] = vi.mocked(useInfiniteList).mock.calls;

            expect(options.queryKey).toEqual(legacy.queryKey);
        });
    },
);
