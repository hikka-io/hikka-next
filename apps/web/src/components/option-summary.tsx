import type { ComponentType, FC, ReactNode } from 'react';

import OptionIcon from '@/components/option-icon';
import { cn } from '@/utils/cn';

export type ChoiceOption = {
    value: string;
    title: string;
    description?: string;
    icon: ComponentType<{ className?: string }>;
};

type Props = {
    option: ChoiceOption;
    hint?: string;
    /** A lock, a chevron: what the row does when it is not a plain label. */
    trailing?: ReactNode;
    className?: string;
};

/** The chosen option on one row, as a select's value or a choice that is locked. */
const OptionSummary: FC<Props> = ({ option, hint, trailing, className }) => (
    <div
        className={cn(
            'flex items-center gap-3 rounded-lg border p-2.5',
            className,
        )}
    >
        <OptionIcon
            icon={option.icon}
            className="bg-primary-foreground/15 text-primary-foreground"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug">
            <span className="font-medium text-sm">{option.title}</span>
            {hint && (
                <span className="text-muted-foreground text-xs">{hint}</span>
            )}
        </div>
        {trailing}
    </div>
);

export default OptionSummary;
