import type { FC } from 'react';

import { type LucideIcon, Meh, ThumbsDown, ThumbsUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import type { Verdict } from './utils/review';

const OPTIONS: {
    value: Verdict;
    label: string;
    icon: LucideIcon;
    active: string;
}[] = [
    {
        value: 'yes',
        label: 'Рекомендую',
        icon: ThumbsUp,
        active: 'border-success-foreground/50 bg-success-foreground/20 text-success-foreground hover:bg-success-foreground/25 hover:text-success-foreground dark:border-success-foreground/50 dark:bg-success-foreground/20 dark:hover:bg-success-foreground/25',
    },
    {
        value: 'maybe',
        label: 'Вагаюсь',
        icon: Meh,
        active: 'border-warning-foreground/50 bg-warning-foreground/20 text-warning-foreground hover:bg-warning-foreground/25 hover:text-warning-foreground dark:border-warning-foreground/50 dark:bg-warning-foreground/20 dark:hover:bg-warning-foreground/25',
    },
    {
        value: 'no',
        label: 'Не рекомендую',
        icon: ThumbsDown,
        active: 'border-destructive-foreground/50 bg-destructive-foreground/20 text-destructive-foreground hover:bg-destructive-foreground/25 hover:text-destructive-foreground dark:border-destructive-foreground/50 dark:bg-destructive-foreground/20 dark:hover:bg-destructive-foreground/25',
    },
];

type Props = {
    value: Verdict | null;
    onChange: (value: Verdict | null) => void;
    className?: string;
    /** Render only the button grid, without the composer surface/border/padding. */
    bare?: boolean;
};

const CommentVerdictPicker: FC<Props> = ({
    value,
    onChange,
    className,
    bare = false,
}) => {
    const buttons = OPTIONS.map(({ value: v, label, icon: Icon, active }) => (
        <Button
            key={v}
            type="button"
            variant="outline"
            onClick={() => onChange(value === v ? null : v)}
            aria-pressed={value === v}
            className={cn(
                'h-auto min-w-0 flex-col gap-1 px-1 py-2 text-xs sm:flex-row sm:gap-2 sm:py-2.5 sm:text-sm',
                value === v && active,
            )}
        >
            <Icon />
            <span className="truncate">{label}</span>
        </Button>
    ));

    if (bare) {
        return (
            <div className={cn('grid grid-cols-3 gap-2', className)}>
                {buttons}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'surface flex flex-col gap-2 border-t px-3 py-3',
                className,
            )}
        >
            <div className="grid grid-cols-3 gap-2">{buttons}</div>
        </div>
    );
};

export default CommentVerdictPicker;
