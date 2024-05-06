'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import HistoryItem from '@/components/history-item';
import LoadMoreButton from '@/components/load-more-button';
import useUserHistory from '@/services/hooks/user/useUserHistory';

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
        <>
            <hr className="-mx-6 mt-4 h-px w-auto bg-border" />
            <div className="-mx-6 h-full w-auto flex-1 overflow-y-scroll">
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
        </>
    );
};

export default Component;
