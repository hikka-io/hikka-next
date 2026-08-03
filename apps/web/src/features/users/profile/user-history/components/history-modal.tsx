import { range } from '@antfu/utils';

import { userHistoryInfiniteOptions } from '@hikka/api';

import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import { HistoryItem, HistoryItemSkeleton } from '@/components/list-items';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

const SKELETON_COUNT = 5;

const HistoryModal = () => {
    const params = useParams();

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchNextPage,
        ref,
    } = useInfiniteList(
        userHistoryInfiniteOptions({
            path: { username: String(params.username) },
        }),
    );

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {isLoading &&
                range(0, SKELETON_COUNT).map((index) => (
                    <HistoryItemSkeleton key={index} />
                ))}
            {list?.map((item) => (
                <HistoryItem data={item} key={item.reference} />
            ))}
            {!isLoading && list?.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsHistoryRounded />}
                    title="Історія відсутня"
                    description="Інформація оновиться після змін у списку"
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

export default HistoryModal;
