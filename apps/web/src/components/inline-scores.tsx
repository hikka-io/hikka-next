import { cn } from '@/utils/cn';

import Hikka from './icons/custom/Hikka';
import MAL from './icons/custom/MAL';
import { ScoreSource } from './score-source';
import { Separator } from './ui/separator';

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
