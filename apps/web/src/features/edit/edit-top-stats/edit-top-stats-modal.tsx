import { range } from '@antfu/utils';

import { editsTopInfiniteOptions } from '@hikka/api';

import MaterialSymbolsKidStar from '@/components/icons/material-symbols/MaterialSymbolsKidStar';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import EditTopListItem from './edit-top-list-item';
import EditTopListItemSkeleton from './edit-top-list-item-skeleton';

const SKELETON_COUNT = 5;

const EditTopStatsModal = () => {
    const {
        list,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        ref,
    } = useInfiniteList(editsTopInfiniteOptions());

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {isLoading &&
                range(0, SKELETON_COUNT).map((index) => (
                    <EditTopListItemSkeleton key={index} />
                ))}
            {list?.map((stat, index) => {
                return (
                    <EditTopListItem
                        key={stat.user.reference}
                        user={stat.user}
                        rank={index + 1}
                        accepted={stat.accepted}
                        closed={stat.closed}
                        denied={stat.denied}
                    />
                );
            })}
            {!isLoading && list?.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsKidStar />}
                    title="Авторів ще немає"
                    description="Тут з’явиться топ авторів, щойно правки почнуть приймати"
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

export default EditTopStatsModal;
