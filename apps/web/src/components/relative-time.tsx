import type { FC } from 'react';

import type { Locale } from 'date-fns';

import { cn } from '@/utils/cn';
import { formatTimestamp } from '@/utils/i18n';

type Props = {
    /** Unix timestamp in seconds (not milliseconds). */
    value: number;
    locale?: Locale;
    className?: string;
};

const RelativeTime: FC<Props> = ({ value, locale, className }) => {
    const { label, full, iso } = formatTimestamp(value, Date.now(), locale);

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
