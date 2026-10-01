import type { FC } from 'react';

import { range } from '@antfu/utils';

import { Skeleton } from '@/components/ui/skeleton';

import { COMMENT_PREVIEW_SIZE } from './queries';

type Props = {
    withContent?: boolean;
};

const CommentSkeleton: FC<Props> = ({ withContent }) => {
    return (
        <div className="flex w-full gap-4">
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm leading-tight">
                        <Skeleton className="h-lh w-28 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                    </div>
                    {withContent && (
                        <Skeleton className="h-8 w-52 rounded-md" />
                    )}
                </div>
                <div className="flex flex-col text-[0.9375rem] leading-relaxed">
                    <div className="flex h-lh items-center">
                        <Skeleton className="h-4 w-full rounded" />
                    </div>
                    <div className="flex h-lh items-center">
                        <Skeleton className="h-4 w-2/3 rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    {!withContent && (
                        <Skeleton className="h-8 w-26 rounded-lg" />
                    )}
                </div>
            </div>
        </div>
    );
};

type ListProps = Props & {
    count?: number;
};

const CommentListSkeleton: FC<ListProps> = ({
    count = COMMENT_PREVIEW_SIZE,
    withContent,
}) => {
    return (
        <div className="flex w-full flex-col gap-6">
            {range(1, count + 1).map((v) => (
                <CommentSkeleton key={v} withContent={withContent} />
            ))}
        </div>
    );
};

export { CommentListSkeleton };
export default CommentSkeleton;
