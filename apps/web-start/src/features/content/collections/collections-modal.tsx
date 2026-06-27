import type { FC } from 'react';

import { getCollectionsInfiniteOptions } from '@hikka/api';

import { CollectionItem } from '@/components/content-card';
import LoadMoreButton from '@/components/load-more-button';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

type Props = {
    content_type: 'anime' | 'manga' | 'novel';
};

const CollectionsModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useInfiniteList(
            getCollectionsInfiniteOptions({
                body: {
                    content_type,
                    content: [String(params.slug)],
                },
            }),
        );

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {list?.map((collection) => (
                <CollectionItem data={collection} key={collection.reference} />
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
