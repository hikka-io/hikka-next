import type { FC } from 'react';

import SegmentedBar from '@/components/ui/segmented-bar';

interface Segment {
    status: string;
    count: number;
    label?: string;
}

type Props = {
    segments: Segment[];
    hoveredStatus?: string | null;
};

// `bg-${status}-foreground` is safelisted for watch/read statuses — see globals.css.
const StatusProgressBar: FC<Props> = ({ segments, hoveredStatus }) => (
    <SegmentedBar
        className="px-2"
        dimmedKey={hoveredStatus}
        segments={segments.map((segment) => ({
            key: segment.status,
            count: segment.count,
            className: `bg-${segment.status}-foreground`,
        }))}
    />
);

export default StatusProgressBar;
