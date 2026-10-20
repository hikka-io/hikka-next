import type { FC } from 'react';

import { View } from 'react-native';

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

/** The web's `SegmentedBar`: proportional coloured segments; every other segment fades while `dimmedKey` is set. */
const SegmentedBar: FC<Props> = ({ segments, dimmedKey, className }) => {
    const total = segments.reduce((sum, segment) => sum + segment.count, 0);

    if (total === 0) return null;

    const dims = segments.some(
        (segment) => segment.key === dimmedKey && segment.count > 0,
    );

    return (
        <View
            accessible={false}
            className={cn('h-2 w-full flex-row gap-1', className)}
        >
            {segments.map((segment) =>
                segment.count > 0 ? (
                    <View
                        key={segment.key}
                        style={{ flexGrow: segment.count, flexBasis: 0 }}
                        className={cn(
                            'min-w-2 rounded-xs',
                            segment.className,
                            dims && dimmedKey !== segment.key && 'opacity-30',
                        )}
                    />
                ) : null,
            )}
        </View>
    );
};

export default SegmentedBar;
