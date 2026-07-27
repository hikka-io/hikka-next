import { type FC, useState } from 'react';

import type { ReviewStatsResponse } from '@hikka/api';

import Card from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import SegmentedBar from '@/components/ui/segmented-bar';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

import { REVIEW_VERDICTS } from './review-verdicts';
import { getReviewTotal, getReviewVerdict, type Verdict } from './utils/review';

const BAR_CLASS: Record<Verdict, string> = {
    yes: 'bg-success-foreground',
    maybe: 'bg-warning-foreground',
    no: 'bg-destructive-foreground',
};

const ACTIVE_CLASS: Record<Verdict, string> = {
    yes: 'border-success-foreground/40 bg-success-foreground/15 text-success-foreground',
    maybe: 'border-warning-foreground/40 bg-warning-foreground/15 text-warning-foreground',
    no: 'border-destructive-foreground/40 bg-destructive-foreground/15 text-destructive-foreground',
};

type Props = {
    stats: ReviewStatsResponse;
    value: Verdict | null;
    onChange: (verdict: Verdict | null) => void;
    className?: string;
};

const ReviewStatsCard: FC<Props> = ({ stats, value, onChange, className }) => {
    const [hovered, setHovered] = useState<Verdict | null>(null);

    const total = getReviewTotal(stats);
    const verdict = getReviewVerdict(stats);

    return (
        <Card
            className={cn('gap-3 p-3 sm:flex-row sm:items-center', className)}
        >
            <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                <SegmentedBar
                    className="w-24 shrink-0 sm:w-40"
                    dimmedKey={hovered}
                    segments={REVIEW_VERDICTS.map((option) => ({
                        key: option.value,
                        count: stats[option.value] ?? 0,
                        className: BAR_CLASS[option.value],
                    }))}
                />
                <span className="truncate font-medium text-sm">{verdict}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:shrink-0">
                {REVIEW_VERDICTS.map(({ value: v, statsLabel, icon: Icon }) => {
                    const count = stats[v] ?? 0;
                    const isActive = value === v;

                    return (
                        <Tooltip key={v}>
                            <TooltipTrigger asChild>
                                <Chip
                                    aria-pressed={isActive}
                                    aria-label={`${statsLabel}: ${count}`}
                                    onClick={() =>
                                        onChange(isActive ? null : v)
                                    }
                                    onMouseEnter={() => setHovered(v)}
                                    onMouseLeave={() => setHovered(null)}
                                    // Keyboard users get the same bar highlight.
                                    onFocus={() => setHovered(v)}
                                    onBlur={() => setHovered(null)}
                                    className={cn(
                                        'w-full justify-center border border-transparent tabular-nums sm:w-auto',
                                        isActive
                                            ? ACTIVE_CLASS[v]
                                            : 'bg-secondary/40 text-muted-foreground hover:bg-accent',
                                    )}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    {count}
                                </Chip>
                            </TooltipTrigger>
                            <TooltipPortal>
                                <TooltipContent side="bottom">
                                    {statsLabel} ·{' '}
                                    {Math.round((count / total) * 100)}%
                                </TooltipContent>
                            </TooltipPortal>
                        </Tooltip>
                    );
                })}
            </div>
        </Card>
    );
};

export default ReviewStatsCard;
