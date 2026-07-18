import Hikka from '../icons/custom/Hikka';
import MAL from '../icons/custom/MAL';
import MaterialSymbolsStarRounded from '../icons/material-symbols/MaterialSymbolsStarRounded';

type Props = {
    hikkaScore?: number;
    hikkaScoreCount?: number;
    malScore?: number;
    malScoreCount?: number;
};

export function InlineScores(props: Props) {
    const { hikkaScore, hikkaScoreCount, malScore, malScoreCount } = props;

    return (
        <div className="flex w-full justify-evenly gap-3">
            {hikkaScore != null && hikkaScore > 0 && (
                <div className="flex items-center gap-2">
                    <Hikka className="h-4 w-4" />
                    <div className="flex items-center gap-0.5 font-bold font-display text-sm">
                        {hikkaScore}
                        <MaterialSymbolsStarRounded className="text-sm text-yellow-400" />
                    </div>
                    {hikkaScoreCount != null && (
                        <span className="text-muted-foreground text-xs tabular-nums @max-2xl:hidden">
                            {new Intl.NumberFormat('en', {
                                notation: 'compact',
                                maximumFractionDigits: 1,
                            }).format(hikkaScoreCount)}
                        </span>
                    )}
                </div>
            )}
            {malScore != null && malScore > 0 && (
                <div className="flex items-center gap-2">
                    <MAL className="h-4 w-4" />
                    <div className="flex items-center gap-0.5 font-bold font-display text-sm">
                        {malScore}
                        <MaterialSymbolsStarRounded className="text-sm text-yellow-400" />
                    </div>
                    {malScoreCount != null && (
                        <span className="text-muted-foreground text-xs tabular-nums @max-2xl:hidden">
                            {new Intl.NumberFormat('en', {
                                notation: 'compact',
                                maximumFractionDigits: 1,
                            }).format(malScoreCount)}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
