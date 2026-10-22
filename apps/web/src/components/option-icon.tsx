import type { ComponentType, FC } from 'react';

import { cn } from '@/utils/cn';

type Props = {
    icon: ComponentType<{ className?: string }>;
    className?: string;
};

/** The icon tile that leads an option in choice cards and their summaries. */
const OptionIcon: FC<Props> = ({ icon: Icon, className }) => (
    <span
        className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground',
            className,
        )}
    >
        <Icon className="size-4" />
    </span>
);

export default OptionIcon;
