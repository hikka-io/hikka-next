import type { ComponentType, FC, ReactNode } from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

type Props = {
    icon: ComponentType<{ className?: string }>;
    title: string;
    /** Lets the section's control name itself after the title (`aria-labelledby`). */
    labelId?: string;
    className?: string;
    children: ReactNode;
};

/** A titled group of settings inside an editor's side panel or drawer. */
const PanelSection: FC<Props> = ({
    icon: Icon,
    title,
    labelId,
    className,
    children,
}) => (
    <div className={cn('flex flex-col gap-3', className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className="size-4 shrink-0" />
            <Label id={labelId}>{title}</Label>
        </div>
        {children}
    </div>
);

export default PanelSection;
