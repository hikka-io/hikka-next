import { FC } from 'react';

const MediaTooltipSkeleton: FC = () => (
    <div className="flex animate-pulse flex-col gap-4">
        <div className="flex justify-between gap-2">
            <div className="h-4 flex-1 rounded-lg bg-secondary/20" />
            <div className="h-4 w-10 rounded-lg bg-secondary/20" />
        </div>
        <div className="flex flex-col gap-2 py-3">
            <div className="h-2 w-full rounded-lg bg-secondary/20" />
            <div className="h-2 w-full rounded-lg bg-secondary/20" />
            <div className="h-2 w-full rounded-lg bg-secondary/20" />
            <div className="h-2 w-full rounded-lg bg-secondary/20" />
            <div className="h-2 w-1/3 rounded-lg bg-secondary/20" />
        </div>
        <div className="flex gap-2">
            <div className="h-3 w-1/4 rounded-lg bg-secondary/20" />
            <div className="h-3 flex-1 rounded-lg bg-secondary/20" />
        </div>
        <div className="flex gap-2">
            <div className="h-3 w-1/4 rounded-lg bg-secondary/20" />
            <div className="h-3 w-2/4 rounded-lg bg-secondary/20" />
        </div>
        <div className="h-12 w-full rounded-md bg-secondary/20" />
    </div>
);

const CharacterTooltipSkeleton: FC = () => (
    <div className="flex w-96 animate-pulse gap-4 text-left">
        <div className="h-28 w-20 rounded-lg bg-secondary/20" />
        <div className="flex w-full flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2">
                <div className="flex w-full flex-1 flex-col gap-2">
                    <div className="h-5 w-20 rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <div className="h-14 w-10 rounded-lg bg-secondary/20" />
        </div>
    </div>
);

const PersonTooltipSkeleton: FC = () => (
    <div className="flex w-96 animate-pulse gap-4 text-left">
        <div className="h-28 w-20 rounded-lg bg-secondary/20" />
        <div className="flex w-full flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2">
                <div className="flex w-full flex-1 flex-col gap-2">
                    <div className="h-5 w-20 rounded-lg bg-secondary/20" />
                </div>
            </div>
            <div className="flex gap-2">
                <div className="h-3 w-1/4 rounded-lg bg-secondary/20" />
            </div>
            <div className="flex gap-2">
                <div className="h-14 w-10 rounded-lg bg-secondary/20" />
                <div className="h-14 w-10 rounded-lg bg-secondary/20" />
                <div className="h-14 w-10 rounded-lg bg-secondary/20" />
                <div className="h-14 w-10 rounded-lg bg-secondary/20" />
                <div className="h-14 w-10 rounded-lg bg-secondary/20" />
            </div>
        </div>
    </div>
);

const UserTooltipSkeleton: FC = () => (
    <div className="flex w-64 flex-col gap-4">
        <div className="flex animate-pulse flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-md bg-secondary/20" />
                    <div className="h-3 w-20 rounded-lg bg-secondary/20" />
                </div>
                <div className="size-9 rounded-md bg-secondary/20" />
            </div>
            <div className="h-3 w-full rounded-lg bg-secondary/20" />
        </div>
        <div className="flex animate-pulse gap-4">
            <div className="h-3 w-24 rounded-lg bg-secondary/20" />
            <div className="h-3 w-24 rounded-lg bg-secondary/20" />
        </div>
        <div className="flex animate-pulse gap-2">
            <div className="h-4 w-1/3 rounded-lg bg-secondary/20" />
            <div className="h-4 w-1/3 rounded-lg bg-secondary/20" />
            <div className="h-4 w-1/3 rounded-lg bg-secondary/20" />
        </div>
    </div>
);

export {
    CharacterTooltipSkeleton,
    MediaTooltipSkeleton,
    PersonTooltipSkeleton,
    UserTooltipSkeleton,
};
