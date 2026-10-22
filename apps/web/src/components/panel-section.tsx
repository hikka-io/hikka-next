import type { ComponentType, FC, ReactNode } from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

type Props = {
    icon: ComponentType<{ className?: string }>;
    title: string;
    /** Lets the section's control name itself after the title (`aria-labelledby`). */
    labelId?: string;
    htmlFor?: string;
    /** A control on the title row, such as a switch that is the whole setting. */
    action?: ReactNode;
    className?: string;
    children?: ReactNode;
};

/** A titled group of settings, spaced like the filter panels. */
const PanelSection: FC<Props> = ({
    icon: Icon,
    title,
    labelId,
    htmlFor,
    action,
    className,
    children,
}) => (
    <div className={cn('flex flex-col gap-4', className)}>
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-4 shrink-0" />
                <Label id={labelId} htmlFor={htmlFor}>
                    {title}
                </Label>
            </div>
            {action}
        </div>
        {children}
    </div>
);

export default PanelSection;
