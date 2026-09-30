import type { FC } from 'react';

import { range } from '@antfu/utils';

import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Stack from '@/components/ui/stack';

type Props = {
    count: number;
};

const FranchiseSkeleton: FC<Props> = ({ count }) => (
    <Block>
        <div className="flex h-8 items-center">
            <Skeleton className="h-6 w-28 rounded" />
        </div>
        <Stack size={2} className="grid-min-20">
            {range(0, count).map((index) => (
                <Card key={index}>
                    <HorizontalCardSkeleton />
                    <Skeleton className="hidden h-10 w-full rounded-md md:block" />
                </Card>
            ))}
        </Stack>
    </Block>
);

export default FranchiseSkeleton;
