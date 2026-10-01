import type { FC } from 'react';

import { range } from '@antfu/utils';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { labelVariants } from '@/components/ui/label';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

import HistoryRow, {
    type HistorySize,
    historyRowsVariants,
} from './history-row';

type Props = {
    count: number;
    size?: HistorySize;
    className?: string;
};

const HistoryTimelineSkeleton: FC<Props> = ({
    count,
    size = 'default',
    className,
}) => (
    <section className={className}>
        {size === 'lg' ? (
            <div className="mb-4 flex items-center gap-2">
                <SkeletonText
                    className="font-bold text-base"
                    barClassName="w-24 rounded"
                />
                <SkeletonText className="text-sm" barClassName="w-16 rounded" />
            </div>
        ) : (
            <div className="mb-3 flex items-center gap-1.5 text-xs">
                <SkeletonText barClassName="w-14 rounded" />
                <SkeletonText barClassName="w-12 rounded" />
            </div>
        )}
        <div className={historyRowsVariants({ size })}>
            {range(0, count).map((index) => (
                <HistoryRow
                    key={index}
                    className="not-last:before:bg-secondary/20"
                    node={<Skeleton className="size-8 shrink-0 rounded-md" />}
                    poster={
                        <AspectRatio ratio={DEFAULT_CONTAINER_RATIO}>
                            <Skeleton className="size-full rounded-(--base-radius)" />
                        </AspectRatio>
                    }
                >
                    <div className="flex gap-3">
                        <SkeletonText
                            className={cn(labelVariants(), 'flex-1')}
                            barClassName="w-1/2 rounded"
                        />
                        <SkeletonText
                            className="text-xs"
                            barClassName="w-9 rounded"
                        />
                    </div>
                    <SkeletonText
                        className={cn('text-xs', size === 'lg' && 'md:text-sm')}
                        barClassName="w-2/3 rounded"
                    />
                </HistoryRow>
            ))}
        </div>
    </section>
);

export default HistoryTimelineSkeleton;
