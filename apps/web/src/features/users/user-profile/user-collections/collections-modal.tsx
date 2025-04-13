'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '../../../../components/load-more-button';
import useUserCollections from '../../../../services/hooks/user/use-user-collections';
import CollectionItem from './collection-item';

interface Props {
    className?: string;
}

const CollectionModal: FC<Props> = ({ className }) => {
    const params = useParams();

    const {
        list: collections,
        hasNextPage,
        isFetchingNextPage,
        ref,
        fetchNextPage,
    } = useUserCollections({
        author: String(params.username),
        sort: 'created',
    });

    return (
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            {collections &&
                collections.map((item) => (
                    <CollectionItem
                        className="px-6 py-4"
                        data={item}
                        key={item.reference}
                    />
                ))}
            {hasNextPage && (
                <div className="px-4">
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={ref}
                    />
                </div>
            )}
        </div>
    );
};

export default CollectionModal;
