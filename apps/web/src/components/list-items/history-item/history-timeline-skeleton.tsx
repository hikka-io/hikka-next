import type { FC } from 'react';

import { range } from '@antfu/utils';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { labelVariants } from '@/components/ui/label';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

import {
    HISTORY_ROW_LINE,
    HISTORY_VARIANTS,
    type HistoryVariant,
} from './history-variants';

type Props = {
    variant: HistoryVariant;
    count: number;
    className?: string;
};

const HistoryTimelineSkeleton: FC<Props> = ({ variant, count, className }) => {
    const config = HISTORY_VARIANTS[variant];

    return (
        <section className={className}>
            {config.largeHeading ? (
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
            <div className={cn('flex flex-col', config.rows)}>
                {range(0, count).map((index) => (
                    <div
                        key={index}
                        className={cn(
                            'flex items-start gap-4',
                            HISTORY_ROW_LINE,
                        )}
                    >
                        <div className="flex shrink-0 items-center gap-3">
                            <Skeleton className="size-8 shrink-0 rounded-md" />
                            <div className={cn('shrink-0', config.poster)}>
                                <AspectRatio ratio={DEFAULT_CONTAINER_RATIO}>
                                    <Skeleton className="size-full rounded-(--base-radius)" />
                                </AspectRatio>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 self-stretch">
                            <SkeletonText
                                className={labelVariants()}
                                barClassName="w-1/2 rounded"
                            />
                            <SkeletonText
                                className="text-xs"
                                barClassName="w-2/3 rounded"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HistoryTimelineSkeleton;
