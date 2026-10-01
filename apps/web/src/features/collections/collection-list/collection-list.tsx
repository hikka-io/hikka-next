import type { FC } from 'react';

import { range } from '@antfu/utils';

import PagePagination from '@/components/page-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import { collectionListOptions } from '../queries';
import CollectionCard from './collection-card';

type Props = {
    page: number;
    sort: 'system_ranking' | 'created';
};

const SKELETON_COUNT = 3;

const CollectionList: FC<Props> = ({ page, sort }) => {
    const { list, pagination } = useInfiniteList(
        collectionListOptions({ page, sort }),
    );

    if (!list) {
        return (
            <div className="grid grid-cols-1 gap-x-16 gap-y-8">
                {range(0, SKELETON_COUNT).map((index) => (
                    <Skeleton key={index} className="h-64 rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-x-16 max-md:[&>*+*]:-mt-px md:gap-y-8">
                {list?.map((collection, _index) => (
                    <CollectionCard
                        maxPreviewItems={6}
                        collection={collection}
                        key={collection.reference}
                    />
                ))}
            </div>
            {pagination && <PagePagination pagination={pagination} />}
        </>
    );
};

export default CollectionList;
