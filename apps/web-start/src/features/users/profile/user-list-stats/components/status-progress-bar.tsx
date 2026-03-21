'use client';

import { FC } from 'react';

import { cn } from '@/utils/cn';

interface Segment {
    status: string;
    count: number;
}

interface Props {
    segments: Segment[];
}

const StatusProgressBar: FC<Props> = ({ segments }) => {
    const total = segments.reduce((acc, s) => acc + s.count, 0);

    if (total === 0) return null;

    return (
        <div className="flex h-2 w-full gap-1 px-2">
            {segments.map(
                (segment) =>
                    segment.count > 0 && (
                        <div
                            key={segment.status}
                            className={cn(
                                'rounded-xs',
                                `bg-${segment.status}-foreground`,
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
