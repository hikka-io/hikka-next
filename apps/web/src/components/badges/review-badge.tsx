import type { FC } from 'react';

import { type LucideIcon, Meh, Star, ThumbsDown, ThumbsUp } from 'lucide-react';

import type { ReviewResponse } from '@hikka/api';

import { chipVariants } from '@/components/ui/chip';
import { cn } from '@/utils/cn';

type Verdict = ReviewResponse['recommended'];

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
    recommended?: Verdict | null;
    score?: number | null;
};

export const ReviewBadge: FC<Props> = ({ recommended, score }) => {
    const verdict = recommended ? VERDICT[recommended] : undefined;
    if (!verdict) return null;

    const Icon = verdict.icon;
    return (
        <span className="flex items-center gap-1">
            <span
                className={cn(
                    chipVariants({ interactive: false }),
                    verdict.className,
                )}
            >
                <Icon className="size-3.5" />
                {verdict.label}
            </span>
            {!!score && (
                <span
                    className={cn(
                        chipVariants({ interactive: false }),
                        verdict.className,
                    )}
                >
                    <Star className="size-3.5" />
                    {score}
                </span>
            )}
        </span>
    );
};
