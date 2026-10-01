import { userHistoryInfiniteOptions } from '@hikka/api';

import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import {
    HistoryTimeline,
    HistoryTimelineSkeleton,
} from '@/components/list-items';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import { DEFAULT_PAGE_SIZE } from '../../queries';

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
            {isLoading && (
                <HistoryTimelineSkeleton
                    variant="panel"
                    count={DEFAULT_PAGE_SIZE}
                />
            )}
            {list && list.length > 0 && (
                <HistoryTimeline items={list} variant="panel" />
            )}
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
