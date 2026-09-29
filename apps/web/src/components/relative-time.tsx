import type { FC } from 'react';

import { cn } from '@/utils/cn';
import { formatTimestamp } from '@/utils/i18n';

type Props = {
    /** Unix timestamp in seconds (not milliseconds). */
    value: number;
    className?: string;
};

const RelativeTime: FC<Props> = ({ value, className }) => {
    const { label, full, iso } = formatTimestamp(value, Date.now());

    return (
        <time
            dateTime={iso}
            title={full}
            suppressHydrationWarning
            className={cn('shrink-0 text-muted-foreground text-xs', className)}
        >
            {label}
        </time>
    );
};

export default RelativeTime;
