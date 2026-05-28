import { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const MediaTooltipSkeleton: FC = () => (
    <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-2">
            <Skeleton className="h-4 flex-1 rounded-lg" />
            <Skeleton className="h-4 w-10 rounded-lg" />
        </div>
        <div className="flex flex-col gap-2 py-3">
            <Skeleton className="h-2 w-full rounded-lg" />
            <Skeleton className="h-2 w-full rounded-lg" />
            <Skeleton className="h-2 w-full rounded-lg" />
            <Skeleton className="h-2 w-full rounded-lg" />
            <Skeleton className="h-2 w-1/3 rounded-lg" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-3 w-1/4 rounded-lg" />
            <Skeleton className="h-3 flex-1 rounded-lg" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-3 w-1/4 rounded-lg" />
            <Skeleton className="h-3 w-2/4 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full" />
    </div>
);

const CharacterTooltipSkeleton: FC = () => (
    <div className="flex w-96 gap-4 text-left">
        <Skeleton className="h-28 w-20 rounded-lg" />
        <div className="flex w-full flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2">
                <div className="flex w-full flex-1 flex-col gap-2">
                    <Skeleton className="h-5 w-20 rounded-lg" />
                    <Skeleton className="h-2 w-full rounded-lg" />
                    <Skeleton className="h-2 w-full rounded-lg" />
                    <Skeleton className="h-2 w-full rounded-lg" />
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <Skeleton className="h-14 w-10 rounded-lg" />
        </div>
    </div>
);

const PersonTooltipSkeleton: FC = () => (
    <div className="flex w-96 gap-4 text-left">
        <Skeleton className="h-28 w-20 rounded-lg" />
        <div className="flex w-full flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2">
                <div className="flex w-full flex-1 flex-col gap-2">
                    <Skeleton className="h-5 w-20 rounded-lg" />
                </div>
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-3 w-1/4 rounded-lg" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-14 w-10 rounded-lg" />
                <Skeleton className="h-14 w-10 rounded-lg" />
                <Skeleton className="h-14 w-10 rounded-lg" />
                <Skeleton className="h-14 w-10 rounded-lg" />
                <Skeleton className="h-14 w-10 rounded-lg" />
            </div>
        </div>
    </div>
);

const UserTooltipSkeleton: FC = () => (
    <div className="flex w-64 flex-col gap-4">
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-10" />
                    <Skeleton className="h-3 w-20 rounded-lg" />
                </div>
                <Skeleton className="size-9" />
            </div>
            <Skeleton className="h-3 w-full rounded-lg" />
        </div>
        <div className="flex gap-4">
            <Skeleton className="h-3 w-24 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-4 w-1/3 rounded-lg" />
            <Skeleton className="h-4 w-1/3 rounded-lg" />
            <Skeleton className="h-4 w-1/3 rounded-lg" />
        </div>
    </div>
);

export {
    CharacterTooltipSkeleton,
    MediaTooltipSkeleton,
    PersonTooltipSkeleton,
    UserTooltipSkeleton,
};
