'use client';

import type { FC } from 'react';

import { useSearchCollections } from '@hikka/react';

import LoadMoreButton from '@/components/load-more-button';
import { useParams } from '@/utils/navigation';

import CollectionItem from './collection-item';

type Props = {
    className?: string;
};

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
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {collections?.map((item) => (
                <CollectionItem data={item} key={item.reference} />
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
