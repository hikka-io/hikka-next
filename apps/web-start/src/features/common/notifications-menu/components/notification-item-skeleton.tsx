'use client';

import { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const NotificationItemSkeleton: FC = () => {
    return (
        <div className="flex gap-3 px-3 py-2.5">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2.5 w-20 opacity-60" />
            </div>
        </div>
    );
};

export default NotificationItemSkeleton;
