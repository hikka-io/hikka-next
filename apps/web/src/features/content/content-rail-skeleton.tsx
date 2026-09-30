import type { FC, PropsWithChildren } from 'react';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

type Props = PropsWithChildren<{
    className?: string;
}>;

const ContentRailSkeleton: FC<Props> = ({ className, children }) => (
    <Card>
        <Block>
            <div className="flex h-8 items-center">
                <Skeleton className="h-6 w-28 rounded" />
            </div>
            <div className={cn('flex flex-col', className)}>{children}</div>
        </Block>
    </Card>
);

export default ContentRailSkeleton;
