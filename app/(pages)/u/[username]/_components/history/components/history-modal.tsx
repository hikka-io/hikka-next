'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

import ActivityItem from './ui/history-item';
import useUserHistory from '@/services/hooks/user/useUserHistory';

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
                        <Button
                            variant="outline"
                            ref={ref}
                            disabled={isFetchingNextPage}
                            onClick={() => hasNextPage && fetchNextPage()}
                            className="w-full"
                        >
                            {isFetchingNextPage && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Завантажити ще
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Component;