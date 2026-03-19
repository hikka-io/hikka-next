'use client';

import { useUserHistory } from '@hikka/react';

import LoadMoreButton from '@/components/load-more-button';

import HistoryItem from '@/features/users/user-history/components/history-item';

import { useParams } from '@/utils/navigation';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const params = useParams();

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useUserHistory({
            username: String(params.username),
        });

    return (
        <div className="-mx-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {list?.map((item) => (
                <HistoryItem data={item} key={item.reference} />
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

export default Component;
