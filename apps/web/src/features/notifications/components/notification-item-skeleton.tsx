import type { FC } from 'react';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const NotificationItemSkeleton: FC = () => {
    return (
        <div className="flex gap-3 border-border border-t border-l-4 border-l-transparent px-3 py-2.5 first:border-t-0">
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <SkeletonText
                    className="text-sm leading-tight"
                    barClassName="w-32"
                />
                <SkeletonText
                    className="text-xs leading-relaxed"
                    barClassName="w-full"
                />
                <SkeletonText className="text-xs" barClassName="w-20" />
            </div>
        </div>
    );
};

export default NotificationItemSkeleton;
