'use client';

import { useSearchCollections } from '@hikka/react';
import { FC, Fragment } from 'react';

import { Separator } from '@/components/ui/separator';

import CollectionItem from './collection-item';

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
                <Fragment key={collection.reference}>
                    {index !== 0 && <Separator />}
                    <CollectionItem collection={collection} />
                </Fragment>
            ))}
        </div>
    );
};

export default CollectionList;
