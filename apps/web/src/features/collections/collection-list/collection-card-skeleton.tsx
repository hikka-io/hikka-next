import type { FC } from 'react';

import { range } from '@antfu/utils';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import Stack, { type StackSize } from '@/components/ui/stack';
import { cn } from '@/utils/cn';

import {
    CARD_ROWS,
    STRIP_CONTAINER_CLASS_NAME,
    STRIP_GRID_CLASS_NAME,
    STRIP_META_CLASS_NAME,
    STRIP_POSTER_CLASS_NAMES,
    STRIP_PREVIEW_ITEMS,
} from './collection-strip';

type Props = {
    className?: string;
};

const CollectionCardSkeleton: FC<Props> = ({ className }) => (
    <div className={cn('flex flex-col p-4 sm:px-0', className)}>
        <div
            className={cn(
                'flex items-center gap-4',
                CARD_ROWS.author,
                STRIP_CONTAINER_CLASS_NAME,
            )}
        >
            <Skeleton className="size-12 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Skeleton className="h-4.5 w-32 rounded-lg" />
                <Skeleton className="my-0.5 h-3 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-10 shrink-0 md:@xl/collection:w-36" />
        </div>
        <Skeleton
            className={cn('my-1 h-5 w-1/2 rounded-lg', CARD_ROWS.title)}
        />
        <div className={cn('flex gap-2', CARD_ROWS.tags)}>
            <Skeleton className="h-5.5 w-20 rounded-sm" />
            <Skeleton className="hidden h-5.5 w-16 rounded-sm md:block" />
        </div>
        <div className={cn(CARD_ROWS.posters, STRIP_CONTAINER_CLASS_NAME)}>
            <Stack
                size={(STRIP_PREVIEW_ITEMS + 1) as StackSize}
                gap="md"
                className={STRIP_GRID_CLASS_NAME}
            >
                {range(0, STRIP_PREVIEW_ITEMS).map((index) => (
                    <div
                        key={index}
                        className={cn(
                            'flex flex-col gap-2',
                            STRIP_POSTER_CLASS_NAMES[index],
                        )}
                    >
                        <PosterCardSkeleton hasTitle={false} />
                        <div
                            className={cn(
                                'mt-1 flex h-10 flex-col justify-center gap-2',
                                STRIP_META_CLASS_NAME,
                            )}
                        >
                            <Skeleton className="h-3 w-full rounded-lg" />
                            <Skeleton className="h-3 w-2/3 rounded-lg" />
                        </div>
                    </div>
                ))}
                <PosterCardSkeleton hasTitle={false} />
            </Stack>
        </div>
        <div className={cn('flex gap-1', CARD_ROWS.stats)}>
            <Skeleton className="h-8 w-22 rounded-lg" />
            <Skeleton className="h-8 w-12 rounded-lg" />
        </div>
    </div>
);

export default CollectionCardSkeleton;
