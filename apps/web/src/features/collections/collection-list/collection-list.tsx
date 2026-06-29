import type { FC } from 'react';

import {
    getCollectionsInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

import CollectionCard from './components/collection-card';

type Props = {
    page: number;
    sort: 'system_ranking' | 'created';
};

const CollectionList: FC<Props> = ({ page, sort }) => {
    const { list } = useInfiniteList(
        paginatedInfiniteOptions(
            getCollectionsInfiniteOptions({
                body: { sort: [`${sort}:desc`] },
            }),
            page,
        ),
    );

    if (!list) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-x-16 gap-y-8">
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
