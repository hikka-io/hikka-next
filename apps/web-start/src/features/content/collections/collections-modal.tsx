'use client';

import { CollectionContentType } from '@hikka/client';
import { useSearchCollections } from '@hikka/react';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import CollectionItem from '@/features/users/profile/user-collections/components/collection-item';

import { useParams } from '@/utils/navigation';

interface Props {
    content_type: CollectionContentType;
}

const CollectionsModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useSearchCollections({
            args: {
                content_type: content_type,
                content: [String(params.slug)],
            },
        });

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {list &&
                list.map((collection) => (
                    <CollectionItem
                        data={collection}
                        key={collection.reference}
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

export default CollectionsModal;
