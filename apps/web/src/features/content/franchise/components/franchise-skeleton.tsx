import type { FC } from 'react';

import { range } from '@antfu/utils';

import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Stack from '@/components/ui/stack';

const PREVIEW_COUNT = 2;

const FranchiseSkeleton: FC = () => (
    <Block>
        <div className="flex h-8 items-center">
            <Skeleton className="h-6 w-28 rounded" />
        </div>
        <Stack size={2} className="grid-min-20">
            {range(0, PREVIEW_COUNT).map((index) => (
                <Card key={index}>
                    <HorizontalCardSkeleton />
                </Card>
            ))}
        </Stack>
    </Block>
);

export default FranchiseSkeleton;
