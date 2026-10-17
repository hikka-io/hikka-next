import type { FC } from 'react';

import { cn } from '@/utils/cn';

type Props = {
    order: number;
    isCurrent: boolean;
    className?: string;
};

const GraphOrderTile: FC<Props> = ({ order, isCurrent, className }) => (
    <span
        className={cn(
            'h-4 min-w-4 rounded-sm border px-0.75 text-center font-bold text-[10px] tabular-nums leading-3.5',
            isCurrent
                ? 'border-primary-foreground bg-primary-foreground text-primary'
                : 'border-primary-border bg-primary text-primary-foreground',
            className,
        )}
    >
        {order}
    </span>
);

export default GraphOrderTile;
