'use client';

import { CollectionContentType } from '@hikka/client';
import { useSearchCollections } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import CollectionItem from '@/features/users/user-profile/components/user-collections/collection-item';

interface Props {
    content_type: CollectionContentType;
}

const ContentCollectionsModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useSearchCollections({
            args: {
                content_type: content_type,
                content: [String(params.slug)],
            },
        });

    return (
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            {list &&
                list.map((collection) => (
                    <CollectionItem
                        className="px-6 py-4"
                        data={collection}
                        key={collection.reference}
                    />
                ))}
            {hasNextPage && (
                <div className="px-6">
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

export default ContentCollectionsModal;