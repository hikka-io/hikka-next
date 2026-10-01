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
            <SkeletonText
                className="mb-4 font-bold text-base"
                barClassName="w-32 rounded"
            />
        ) : (
            <SkeletonText
                className="mb-3 text-xs"
                barClassName="w-24 rounded"
            />
        )}
        <div className={historyRowsVariants({ size })}>
            {range(0, count).map((index) => (
                <HistoryRow
                    key={index}
                    node={<Skeleton className="size-8 shrink-0 rounded-md" />}
                    poster={
                        <AspectRatio ratio={DEFAULT_CONTAINER_RATIO}>
                            <Skeleton className="size-full rounded-(--base-radius)" />
                        </AspectRatio>
                    }
                >
                    <SkeletonText
                        className={labelVariants()}
                        barClassName="w-1/2 rounded"
                    />
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
