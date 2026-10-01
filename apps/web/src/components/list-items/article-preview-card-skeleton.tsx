import type { FC } from 'react';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

type Props = {
    titleLines?: 1 | 2;
};

const ArticlePreviewCardSkeleton: FC<Props> = ({ titleLines = 2 }) => (
    <div className="relative flex flex-col gap-2 rounded-sm px-2 py-2 before:pointer-events-none before:absolute before:-top-px before:right-0 before:left-0 before:h-px before:bg-border/60 first:before:hidden">
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <Skeleton className="size-5 shrink-0 rounded-sm" />
                <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-5.5 w-16 rounded-sm" />
        </div>
        <div className="flex flex-col gap-2 py-1">
            <SkeletonText
                className="text-sm leading-snug"
                barClassName="rounded"
                lines={titleLines}
            />
            <SkeletonText className="text-xs" barClassName="h-3 rounded" />
        </div>
        <div className="flex h-lh items-center justify-between gap-2 text-xs leading-normal">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
        </div>
    </div>
);

export default ArticlePreviewCardSkeleton;
