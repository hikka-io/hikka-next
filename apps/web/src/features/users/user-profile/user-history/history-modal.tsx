'use client';

import { useUserHistory } from '@hikka/react';
import { useParams } from 'next/navigation';

import HistoryItem from '@/components/history-item';
import LoadMoreButton from '@/components/load-more-button';

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
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            {list?.map((item) => (
                <HistoryItem
                    className="px-6 py-4"
                    data={item}
                    key={item.reference}
                />
            ))}
            {hasNextPage && (
                <div className="px-4">
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

export default Component;
