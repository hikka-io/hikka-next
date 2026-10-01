import type { FC } from 'react';

import { range } from '@antfu/utils';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

import { DEFAULT_CONTAINER_RATIO } from '../image-presets';

const PREVIEW_THUMB_COUNT = 5;

const Poster: FC<{ className: string; rounded?: string }> = ({
    className,
    rounded = 'rounded-md',
}) => (
    <AspectRatio ratio={DEFAULT_CONTAINER_RATIO} className={className}>
        <Skeleton className={cn('size-full', rounded)} />
    </AspectRatio>
);

const TooltipRowSkeleton: FC<{ lines?: number }> = ({ lines = 1 }) => (
    <div className="flex">
        <div className="flex h-6 w-1/4 items-center">
            <Skeleton className="h-3 w-2/3 rounded-lg" />
        </div>
        <SkeletonText
            className="flex-1"
            barClassName="h-3 rounded-lg"
            lines={lines}
        />
    </div>
);

type MediaTooltipSkeletonProps = {
    withAction?: boolean;
};

const MediaTooltipSkeleton: FC<MediaTooltipSkeletonProps> = ({
    withAction,
}) => (
    <>
        <div className="flex flex-col gap-2">
            <SkeletonText
                className="text-base"
                barClassName="h-4 w-2/3 rounded-lg"
            />
            <div className="flex h-5 items-center gap-3">
                <Skeleton className="h-4 w-20 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-lg" />
            </div>
            <SkeletonText
                className="mb-2 text-sm leading-relaxed"
                barClassName="h-2 rounded-lg"
                lines={4}
            />
            <TooltipRowSkeleton />
            <TooltipRowSkeleton />
            <TooltipRowSkeleton lines={2} />
        </div>
        {withAction && <Skeleton className="h-12 w-full" />}
    </>
);

const CharacterTooltipSkeleton: FC = () => (
    <div className="flex w-96 gap-4 text-left">
        <Poster className="w-20 shrink-0" />
        <div className="flex w-full flex-1 flex-col gap-2">
            <SkeletonText
                className="font-bold text-sm leading-tight"
                barClassName="w-1/3 rounded-lg"
            />
            <SkeletonText
                className="text-sm leading-relaxed"
                barClassName="h-2 rounded-lg"
                lines={3}
            />
        </div>
        <Poster className="w-10 shrink-0" rounded="rounded-(--base-radius)" />
    </div>
);

const PersonTooltipSkeleton: FC = () => (
    <div className="flex w-96 gap-4 text-left">
        <Poster className="w-20 shrink-0" />
        <div className="flex w-full flex-1 flex-col gap-2">
            <SkeletonText
                className="font-bold text-sm leading-tight"
                barClassName="w-1/3 rounded-lg"
            />
            <div className="mt-2 flex flex-col gap-2">
                <SkeletonText
                    className="text-sm leading-tight"
                    barClassName="h-3 w-1/4 rounded-lg"
                />
                <div className="flex gap-2">
                    {range(0, PREVIEW_THUMB_COUNT).map((index) => (
                        <Poster key={index} className="w-10 shrink-0" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const UserTooltipSkeleton: FC = () => (
    <div className="flex w-64 flex-col gap-4">
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-10" />
                    <SkeletonText
                        className="w-20 text-sm"
                        barClassName="h-3 rounded-lg"
                    />
                </div>
                <Skeleton className="size-9" />
            </div>
            <SkeletonText
                className="text-xs leading-relaxed"
                barClassName="h-3 rounded-lg"
            />
        </div>
        <div className="flex gap-4 text-xs">
            <SkeletonText className="w-20" barClassName="h-3 rounded-lg" />
            <SkeletonText className="w-24" barClassName="h-3 rounded-lg" />
        </div>
        <Separator className="-mx-4 w-auto" />
        <div className="flex h-5 gap-2">
            <Skeleton className="h-full flex-1 rounded-lg" />
            <Skeleton className="h-full flex-1 rounded-lg" />
            <Skeleton className="h-full flex-1 rounded-lg" />
        </div>
    </div>
);

export {
    CharacterTooltipSkeleton,
    MediaTooltipSkeleton,
    PersonTooltipSkeleton,
    UserTooltipSkeleton,
};
