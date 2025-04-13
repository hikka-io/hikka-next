'use client';

import { FC, Fragment } from 'react';

import { Separator } from '../../../components/ui/separator';
import useCollections from '../../../services/hooks/collections/use-collections';
import CollectionItem from './collection-item';

interface Props {
    page: number;
    sort: 'system_ranking' | 'created';
}

const CollectionList: FC<Props> = ({ page, sort }) => {
    const { data: collections } = useCollections({
        page,
        sort,
    });

    if (!collections) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-x-16 gap-y-8">
            {collections.list.map((collection, index) => (
                <Fragment key={collection.reference}>
                    {index !== 0 && <Separator />}
                    <CollectionItem collection={collection} />
                </Fragment>
            ))}
        </div>
    );
};

export default CollectionList;
