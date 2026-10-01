import { range } from '@antfu/utils';

import Card from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PREVIEW_LINES = 7;

const ArticleItemSkeleton = () => {
    return (
        <Card className="gap-0 overflow-hidden rounded-none border-x-0 p-0 md:rounded-lg md:border-x">
            <div className="flex items-center gap-4 p-4">
                <Skeleton className="size-12 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Skeleton className="h-4.5 w-24 rounded-lg" />
                    <Skeleton className="my-0.5 h-3 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-10 shrink-0 md:w-36" />
            </div>
            <div className="flex flex-col gap-4 px-4">
                <Skeleton className="my-1 h-5 w-2/3 rounded-lg" />
                <div className="flex gap-2">
                    <Skeleton className="h-5.5 w-20 rounded-sm" />
                    <Skeleton className="h-5.5 w-14 rounded-sm" />
                </div>
                <div className="flex flex-col gap-3 py-1">
                    {range(0, PREVIEW_LINES).map((index) => (
                        <Skeleton
                            key={index}
                            className="h-3 w-full rounded-lg last:w-1/3"
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-1 p-4">
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-8 w-12 rounded-lg" />
            </div>
        </Card>
    );
};

export default ArticleItemSkeleton;
