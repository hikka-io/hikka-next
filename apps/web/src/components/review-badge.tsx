import type { FC } from 'react';

import { type LucideIcon, Meh, ThumbsDown, ThumbsUp } from 'lucide-react';

import { chipVariants } from '@/components/ui/chip';
import { cn } from '@/utils/cn';

type Verdict = 'yes' | 'no' | 'maybe';

// token text color + faint same-color tint background
const VERDICT: Record<
    Verdict,
    { label: string; className: string; icon: LucideIcon }
> = {
    yes: {
        label: 'Рекомендує',
        className: 'text-success-foreground bg-success-foreground/10',
        icon: ThumbsUp,
    },
    no: {
        label: 'Не рекомендує',
        className: 'text-destructive-foreground bg-destructive-foreground/10',
        icon: ThumbsDown,
    },
    maybe: {
        label: 'Вагається',
        className: 'text-warning-foreground bg-warning-foreground/10',
        icon: Meh,
    },
};

type Props = {
    recommended?: string | null;
};

const ReviewBadge: FC<Props> = ({ recommended }) => {
    const verdict = recommended ? VERDICT[recommended as Verdict] : undefined;
    if (!verdict) return null;

    const Icon = verdict.icon;
    return (
        <span
            className={cn(
                chipVariants({ interactive: false }),
                verdict.className,
            )}
        >
            <Icon className="size-3.5" />
            {verdict.label}
        </span>
    );
};

export default ReviewBadge;
