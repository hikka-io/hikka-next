import type { FC } from 'react';

import { range } from '@antfu/utils';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Card from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Stack, { type StackSize } from '@/components/ui/stack';

type Props = {
    maxPreviewItems: number;
};

const CollectionCardSkeleton: FC<Props> = ({ maxPreviewItems }) => {
    return (
        <Card className="-mx-4 rounded-none border-x-0 md:mx-0 md:rounded-lg md:border-x">
            <div className="flex items-center gap-4">
                <Skeleton className="size-12 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Skeleton className="h-4.5 w-32 rounded-lg" />
                    <Skeleton className="my-0.5 h-3 w-20 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-10 shrink-0 md:w-36" />
            </div>
            <Skeleton className="my-1 h-5 w-1/2 rounded-lg" />
            <div className="flex gap-2">
                <Skeleton className="h-5.5 w-20 rounded-sm" />
                <Skeleton className="hidden h-5.5 w-16 rounded-sm md:block" />
            </div>
            <Stack size={(maxPreviewItems + 1) as StackSize} gap="md">
                {range(0, maxPreviewItems).map((index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <PosterCardSkeleton hasTitle={false} />
                        <div className="mt-1 flex h-10 flex-col justify-center gap-2">
                            <Skeleton className="h-3 w-full rounded-lg" />
                            <Skeleton className="h-3 w-2/3 rounded-lg" />
                        </div>
                    </div>
                ))}
                <PosterCardSkeleton hasTitle={false} />
            </Stack>
            <div className="flex gap-1">
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-8 w-13 rounded-lg" />
            </div>
        </Card>
    );
};

export default CollectionCardSkeleton;
