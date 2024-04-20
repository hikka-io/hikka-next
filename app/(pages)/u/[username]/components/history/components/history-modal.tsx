'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import { Button } from '@/components/ui/button';
import useUserHistory from '@/services/hooks/user/useUserHistory';

import ActivityItem from './ui/history-item';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const params = useParams();

    const {
        list: activity,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        ref,
    } = useUserHistory({
        username: String(params.username),
    });

    return (
        <>
            <hr className="-mx-6 mt-4 h-px w-auto bg-border" />
            <div className="-mx-6 h-full w-auto flex-1 overflow-y-scroll">
                {activity &&
                    activity.map((item) => (
                        <ActivityItem
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
