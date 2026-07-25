import type { FC } from 'react';

import { cn } from '@/utils/cn';

type Props = {
    count: number;
    className?: string;
};

const NotificationCountBadge: FC<Props> = ({ count, className }) => (
    <span
        className={cn(
            'flex h-4 min-w-4 items-center justify-center rounded-full border border-warning-border bg-warning px-1 font-bold text-[0.625rem] text-warning-foreground leading-none tabular-nums',
            className,
        )}
    >
        {count < 100 ? count : '99+'}
    </span>
);

export default NotificationCountBadge;
