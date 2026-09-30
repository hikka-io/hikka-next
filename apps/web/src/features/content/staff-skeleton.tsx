import type { FC } from 'react';

import { range } from '@antfu/utils';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Block from '@/components/ui/block';
import { Skeleton } from '@/components/ui/skeleton';
import Stack from '@/components/ui/stack';

type Props = {
    count: number;
};

const StaffSkeleton: FC<Props> = ({ count }) => (
    <Block>
        <div className="flex h-8 items-center">
            <Skeleton className="h-6 w-28 rounded" />
        </div>
        <Stack
            size={5}
            className="grid-min-6 grid-cols-3 sm:grid-cols-4"
            imagePreset="card"
        >
            {range(0, count).map((index) => (
                <PosterCardSkeleton key={index} />
            ))}
        </Stack>
    </Block>
);

export default StaffSkeleton;
