import type { FC } from 'react';

import { cn } from '@/utils/cn';

export type BarSegment = {
    key: string;
    count: number;
    /** Static Tailwind background class. Never interpolate — Tailwind can't see it. */
    className: string;
};

type Props = {
    segments: BarSegment[];
    /** Every segment except this one fades out. */
    dimmedKey?: string | null;
    className?: string;
};

// `min-w-2` keeps a one-unit segment visible as a square dot instead of a hairline.
const SegmentedBar: FC<Props> = ({ segments, dimmedKey, className }) => {
    const total = segments.reduce((acc, segment) => acc + segment.count, 0);

    if (total === 0) return null;

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
                                dimmedKey &&
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
