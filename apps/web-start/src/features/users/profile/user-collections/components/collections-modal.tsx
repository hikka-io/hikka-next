import type { ComponentProps, FC } from 'react';

import { getCollectionsInfiniteOptions } from '@hikka/api';

import { CollectionItem } from '@/components/content-card';
import LoadMoreButton from '@/components/load-more-button';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

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
    } = useInfiniteList(
        getCollectionsInfiniteOptions({
            body: {
                author: String(params.username),
                sort: ['created:desc'],
                only_public: false,
            },
        }),
    );

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {collections?.map((item) => (
                <CollectionItem
                    data={
                        // TODO(phase2): drop cast once content-card is on @hikka/api
                        item as unknown as ComponentProps<
                            typeof CollectionItem
                        >['data']
                    }
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
