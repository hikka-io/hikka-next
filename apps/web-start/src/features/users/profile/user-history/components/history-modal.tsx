'use client';

import { useUserHistory } from '@hikka/react';
import { useParams } from '@/utils/navigation';

import LoadMoreButton from '@/components/load-more-button';

import HistoryItem from '@/features/users/user-history/components/history-item';

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
        <div className="flex-1 overflow-y-scroll gap-6 -mx-4 p-4 flex flex-col">
            {list?.map((item) => (
                <HistoryItem
                    data={item}
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

export default Component;
