import type { FC, ReactNode } from 'react';

import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';

const compact = (n: number) =>
    new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(n);

type Props = {
    icon: ReactNode;
    score: number;
    scoredBy?: number;
};

export const ScoreSource: FC<Props> = ({ icon, score, scoredBy }) => (
    <div className="flex items-center gap-2">
        {icon}
        <div className="flex items-center gap-0.5 font-bold font-display text-sm">
            {score}
            <MaterialSymbolsStarRounded className="text-sm text-yellow-400" />
        </div>
        {!!scoredBy && (
            <span className="text-muted-foreground text-xs tabular-nums">
                {compact(scoredBy)}
            </span>
        )}
    </div>
);
