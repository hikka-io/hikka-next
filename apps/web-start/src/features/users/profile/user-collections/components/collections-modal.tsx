'use client';

import { useSearchCollections } from '@hikka/react';
import { useParams } from '@/utils/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';

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
    } = useSearchCollections({
        args: {
            author: String(params.username),
            sort: ['created:desc'],
            only_public: false,
        },
    });

    return (
        <div className="flex-1 overflow-y-scroll gap-6 -mx-4 p-4 flex flex-col">
            {collections &&
                collections.map((item) => (
                    <CollectionItem
                        data={item}
                        key={item.reference}
                    />
                ))}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </div>
    );
};

export default CollectionModal;
