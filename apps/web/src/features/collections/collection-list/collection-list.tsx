import type { FC } from 'react';

import { range } from '@antfu/utils';

import type { CollectionsSearch } from '@hikka/core';

import FiltersNotFound from '@/components/filters-not-found';
import PagePagination from '@/components/page-pagination';
import DividedList from '@/components/ui/divided-list';
import { useViewPreference } from '@/services/hooks/use-view-preference';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import { collectionListOptions } from '../queries';
import CollectionCard from './collection-card';
import CollectionCardSkeleton from './collection-card-skeleton';
import { GRID_CELL_CLASS_NAME } from './collection-strip';
import { COLLECTIONS_VIEW_KEY } from './constants';

type Props = {
    search: CollectionsSearch;
};

type View = 'list' | 'grid';

const LAYOUTS = {
    list: { columns: 1, itemClassName: undefined, skeletons: 3 },
    grid: { columns: 2, itemClassName: GRID_CELL_CLASS_NAME, skeletons: 4 },
} satisfies Record<
    View,
    { columns: 1 | 2; itemClassName?: string; skeletons: number }
>;

const CollectionList: FC<Props> = ({ search }) => {
    const { view } = useViewPreference(COLLECTIONS_VIEW_KEY);
    const { list, pagination } = useInfiniteList(collectionListOptions(search));

    const layout = LAYOUTS[view === 'grid' ? 'grid' : 'list'];

    if (!list) {
        return (
            <DividedList columns={layout.columns}>
                {range(0, layout.skeletons).map((index) => (
                    <CollectionCardSkeleton
                        key={index}
                        className={layout.itemClassName}
                    />
                ))}
            </DividedList>
        );
    }

    return (
        <>
            {list.length === 0 ? (
                <FiltersNotFound
                    search={{ page: 1, content_type: search.content_type }}
                />
            ) : (
                <DividedList columns={layout.columns}>
                    {list.map((collection) => (
                        <CollectionCard
                            key={collection.reference}
                            collection={collection}
                            className={layout.itemClassName}
                        />
                    ))}
                </DividedList>
            )}
            {pagination && <PagePagination pagination={pagination} />}
        </>
    );
};

export default CollectionList;
