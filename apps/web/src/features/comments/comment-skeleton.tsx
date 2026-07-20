import type { FC } from 'react';

import { range } from '@antfu/utils';

import { Skeleton } from '@/components/ui/skeleton';

const CommentSkeleton: FC = () => {
    return (
        <div className="flex w-full gap-4">
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-7 w-16 rounded-md" />
                    <Skeleton className="h-7 w-24 rounded-md" />
                </div>
            </div>
        </div>
    );
};

type ListProps = {
    count?: number;
};

const CommentListSkeleton: FC<ListProps> = ({ count = 3 }) => {
    return (
        <div className="flex w-full flex-col gap-6">
            {range(1, count + 1).map((v) => (
                <CommentSkeleton key={v} />
            ))}
        </div>
    );
};

export { CommentListSkeleton };
export default CommentSkeleton;
