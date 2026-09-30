import type { FC } from 'react';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

import { collectionListOptions } from '../queries';
import CollectionCard from './collection-card';

type Props = {
    page: number;
    sort: 'system_ranking' | 'created';
};

const CollectionList: FC<Props> = ({ page, sort }) => {
    const { list } = useInfiniteList(collectionListOptions({ page, sort }));

    if (!list) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-x-16 max-md:[&>*+*]:-mt-px md:gap-y-8">
            {list?.map((collection, _index) => (
                <CollectionCard
                    maxPreviewItems={6}
                    collection={collection}
                    key={collection.reference}
                />
            ))}
        </div>
    );
};

export default CollectionList;
