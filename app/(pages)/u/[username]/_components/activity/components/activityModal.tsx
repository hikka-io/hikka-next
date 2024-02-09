'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import { useActivityList } from '@/app/(pages)/u/[username]/page.hooks';
import { Button } from '@/components/ui/button';

import ActivityItem from './ui/activity-item';

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
    } = useActivityList({
        username: String(params.username),
    });

    return (
        <>
            <hr className="h-[1px] w-auto -mx-6 bg-border mt-4" />
            <div className="flex-1 overflow-y-scroll w-auto h-full -mx-6">
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
                        <Button
                            variant="secondary"
                            ref={ref}
                            disabled={isFetchingNextPage}
                            onClick={() => hasNextPage && fetchNextPage()}
                            className="w-full"
                        >
                            {isFetchingNextPage && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Заванатажити ще
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Component;