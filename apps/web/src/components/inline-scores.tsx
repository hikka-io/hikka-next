import type { FC, ReactNode } from 'react';

import Hikka from '@/components/icons/custom/Hikka';
import MAL from '@/components/icons/custom/MAL';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { formatCompactNumber } from '@/utils/i18n/number';

type ScoreSourceProps = {
    icon: ReactNode;
    score: number;
    scoredBy?: number;
};

const ScoreSource: FC<ScoreSourceProps> = ({ icon, score, scoredBy }) => (
    <div className="flex items-center gap-2">
        {icon}
        <div className="flex items-center gap-0.5 font-bold font-display text-sm">
            {score}
            <MaterialSymbolsStarRounded className="text-sm text-yellow-400" />
        </div>
        {!!scoredBy && (
            <span className="text-muted-foreground text-xs tabular-nums">
                {formatCompactNumber(scoredBy)}
            </span>
        )}
    </div>
);

type Props = {
    hikkaScore?: number;
    hikkaScoreCount?: number;
    malScore?: number;
    malScoreCount?: number;
    className?: string;
};

export function InlineScores({
    hikkaScore,
    hikkaScoreCount,
    malScore,
    malScoreCount,
    className,
}: Props) {
    const hasMal = malScore != null && malScore > 0;
    const hasHikka = hikkaScore != null && hikkaScore > 0;

    if (!hasMal && !hasHikka) return null;

    return (
        <div className={cn('flex items-center gap-3', className)}>
            {hasMal && (
                <ScoreSource
                    icon={<MAL className="h-4 w-4 text-foreground" />}
                    score={malScore as number}
                    scoredBy={malScoreCount}
                />
            )}
            {hasMal && hasHikka && (
                <Separator orientation="vertical" className="h-5" />
            )}
            {hasHikka && (
                <ScoreSource
                    icon={<Hikka className="h-4 w-4 shrink-0" />}
                    score={hikkaScore as number}
                    scoredBy={hikkaScoreCount}
                />
            )}
        </div>
    );
}
