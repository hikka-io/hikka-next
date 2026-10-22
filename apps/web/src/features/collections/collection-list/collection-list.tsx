import type { FC } from 'react';

import { range } from '@antfu/utils';

import type { CollectionsSearch } from '@hikka/core';

import FiltersNotFound from '@/components/filters-not-found';
import PagePagination from '@/components/page-pagination';
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
    list: {
        className:
            '-mx-4 flex flex-col divide-y divide-border border-t sm:mx-0',
        itemClassName: undefined,
        skeletons: 3,
    },
    // Each row ends with its own line, since a two-column row has no single last item.
    grid: {
        className:
            '-mx-4 grid grid-cols-1 divide-y divide-border border-t sm:mx-0 sm:grid-cols-2 sm:gap-x-12 sm:[&>*]:border-b',
        itemClassName: GRID_CELL_CLASS_NAME,
        skeletons: 4,
    },
} satisfies Record<View, Record<string, unknown>>;

const CollectionList: FC<Props> = ({ search }) => {
    const { view } = useViewPreference(COLLECTIONS_VIEW_KEY);
    const { list, pagination } = useInfiniteList(collectionListOptions(search));

    const layout = LAYOUTS[view === 'grid' ? 'grid' : 'list'];

    if (!list) {
        return (
            <div className={layout.className}>
                {range(0, layout.skeletons).map((index) => (
                    <CollectionCardSkeleton
                        key={index}
                        className={layout.itemClassName}
                    />
                ))}
            </div>
        );
    }

    return (
        <>
            {list.length === 0 ? (
                <FiltersNotFound
                    search={{ page: 1, content_type: search.content_type }}
                />
            ) : (
                <div className={layout.className}>
                    {list.map((collection) => (
                        <CollectionCard
                            key={collection.reference}
                            collection={collection}
                            className={layout.itemClassName}
                        />
                    ))}
                </div>
            )}
            {pagination && <PagePagination pagination={pagination} />}
        </>
    );
};

export default CollectionList;
