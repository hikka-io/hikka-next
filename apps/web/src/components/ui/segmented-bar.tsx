import type { FC } from 'react';

import { cn } from '@/utils/cn';

export type BarSegment = {
    key: string;
    count: number;
    className: string;
};

type Props = {
    segments: BarSegment[];
    dimmedKey?: string | null;
    className?: string;
};

const SegmentedBar: FC<Props> = ({ segments, dimmedKey, className }) => {
    const total = segments.reduce((acc, segment) => acc + segment.count, 0);

    if (total === 0) return null;

    const dims = segments.some(
        (segment) => segment.key === dimmedKey && segment.count > 0,
    );

    return (
        <div className={cn('flex h-2 w-full gap-1', className)}>
            {segments.map(
                (segment) =>
                    segment.count > 0 && (
                        <div
                            key={segment.key}
                            className={cn(
                                'min-w-2 rounded-xs transition-opacity',
                                segment.className,
                                dims &&
                                    dimmedKey !== segment.key &&
                                    'opacity-30',
                            )}
                            style={{
                                width: `${(segment.count / total) * 100}%`,
                            }}
                        />
                    ),
            )}
        </div>
    );
};

export default SegmentedBar;
