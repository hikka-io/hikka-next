import type { FC } from 'react';

import { range } from '@antfu/utils';

import PagePagination from '@/components/page-pagination';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import { collectionListOptions } from '../queries';
import CollectionCard from './collection-card';
import CollectionCardSkeleton from './collection-card-skeleton';

type Props = {
    page: number;
    sort: 'system_ranking' | 'created';
};

const SKELETON_COUNT = 3;
const PREVIEW_ITEMS = 6;
const LIST_CLASSNAME =
    'grid grid-cols-1 gap-x-16 max-md:[&>*+*]:-mt-px md:gap-y-8';

const CollectionList: FC<Props> = ({ page, sort }) => {
    const { list, pagination } = useInfiniteList(
        collectionListOptions({ page, sort }),
    );

    if (!list) {
        return (
            <div className={LIST_CLASSNAME}>
                {range(0, SKELETON_COUNT).map((index) => (
                    <CollectionCardSkeleton
                        key={index}
                        maxPreviewItems={PREVIEW_ITEMS}
                    />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className={LIST_CLASSNAME}>
                {list?.map((collection, _index) => (
                    <CollectionCard
                        maxPreviewItems={PREVIEW_ITEMS}
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
