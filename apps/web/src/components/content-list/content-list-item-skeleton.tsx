import type { FC } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

import { Separator } from '../ui/separator';

const ContentListItemSkeleton: FC = () => {
    return (
        <div className="surface -mx-4 flex flex-col gap-4 rounded-none border border-border border-x-0 p-4 md:mx-0 md:rounded-(--base-radius) md:border-x">
            <div className="flex gap-4">
                <div className="w-24 shrink-0 md:w-16">
                    <AspectRatio ratio={0.7}>
                        <Skeleton className="size-full rounded-(--base-radius)" />
                    </AspectRatio>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-stretch">
                    <div className="flex min-w-0 flex-1 flex-col justify-start gap-3 md:justify-center">
                        <Skeleton className="h-4 w-2/3 rounded-lg" />
                        <Skeleton className="h-3 w-1/2 rounded-lg" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                        </div>
                    </div>
                    <Separator
                        orientation="vertical"
                        className="hidden md:block"
                    />
                    <div className="flex flex-col justify-center gap-3 md:w-64 md:shrink-0">
                        <Skeleton className="h-5 w-40 rounded-lg" />
                        <Skeleton className="hidden h-10 w-full rounded-md md:block" />
                    </div>
                </div>
            </div>
            <Skeleton className="h-10 w-full rounded-md md:hidden" />
        </div>
    );
};

export default ContentListItemSkeleton;
