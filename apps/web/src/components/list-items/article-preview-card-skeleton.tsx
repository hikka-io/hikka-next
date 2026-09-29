import type { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const ArticlePreviewCardSkeleton: FC = () => (
    <div className="flex flex-col gap-2 rounded-sm border-border/60 border-t px-2 py-2 first:border-t-0">
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
                <Skeleton className="size-[18px] shrink-0 rounded-sm" />
                <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-5 w-16 rounded-sm" />
        </div>
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
        </div>
    </div>
);

export default ArticlePreviewCardSkeleton;
