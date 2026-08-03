import type { FC } from 'react';

import { range } from '@antfu/utils';

import {
    type CollectionContentTypeEnum,
    getCollectionsInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import {
    CollectionItem,
    CollectionItemSkeleton,
} from '@/components/list-items';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

const SKELETON_COUNT = 5;

type Props = {
    content_type: CollectionContentTypeEnum;
};

const CollectionsModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchNextPage,
        ref,
    } = useInfiniteList(
        getCollectionsInfiniteOptions({
            body: {
                content_type,
                content: [String(params.slug)],
            },
        }),
    );

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {isLoading &&
                range(0, SKELETON_COUNT).map((index) => (
                    <CollectionItemSkeleton key={index} />
                ))}
            {list?.map((collection) => (
                <CollectionItem data={collection} key={collection.reference} />
            ))}
            {!isLoading && list?.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsStack />}
                    title="Колекцій не знайдено"
                    description="Цей тайтл ще не додано до жодної колекції"
                />
            )}
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
