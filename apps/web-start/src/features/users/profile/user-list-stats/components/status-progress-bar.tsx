'use client';

import { FC } from 'react';

import { cn } from '@/utils/cn';

interface Segment {
    status: string;
    count: number;
    label?: string;
}

interface Props {
    segments: Segment[];
    hoveredStatus?: string | null;
}

const StatusProgressBar: FC<Props> = ({ segments, hoveredStatus }) => {
    const total = segments.reduce((acc, s) => acc + s.count, 0);

    if (total === 0) return null;

    return (
        <div className="flex h-2 w-full gap-1 px-2">
            {segments.map(
                (segment) =>
                    segment.count > 0 && (
                        <div
                            className={cn(
                                'min-w-2 rounded-xs transition-opacity',
                                `bg-${segment.status}-foreground`,
                                hoveredStatus &&
                                    hoveredStatus !== segment.status &&
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

export default StatusProgressBar;
