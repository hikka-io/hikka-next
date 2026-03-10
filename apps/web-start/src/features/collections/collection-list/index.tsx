'use client';

import { useSearchCollections } from '@hikka/react';
import { FC } from 'react';

import CollectionCard from './components/collection-card';

interface Props {
    page: number;
    sort: 'system_ranking' | 'created';
}

const CollectionList: FC<Props> = ({ page, sort }) => {
    const { list } = useSearchCollections({
        args: { sort: [`${sort}:desc`] },
        paginationArgs: {
            page,
        },
    });

    if (!list) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-x-16 gap-y-8">
            {list?.map((collection, index) => (
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
