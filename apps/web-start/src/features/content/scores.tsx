'use client';

import { ContentTypeEnum } from '@hikka/client';

import Hikka from '@/components/icons/custom/Hikka';
import MAL from '@/components/icons/custom/MAL';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils/cn';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

interface ScoresProps {
    className?: string;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const Scores = ({ className, content_type }: ScoresProps) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    const compact = (n: number) =>
        new Intl.NumberFormat('en', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(n);

    if (!data || (data.score === 0 && data.native_score === 0)) {
        return null;
    }

    return (
        <div
            id="content-scores"
            className={cn(
                'flex gap-4 bg-secondary/20 backdrop-blur p-2 px-4 rounded-md border items-center',
                (data.score === 0 || data.native_score === 0) &&
                    'w-fit self-end',
                className,
            )}
        >
            {!!data.score && (
                <div className="flex gap-4 items-center justify-center flex-1">
                    <MAL className="w-4 h-4 text-foreground" />
                    <div className="flex flex-col items-start justify-start">
                        <div className="flex items-center gap-1">
                            <p className="font-display  font-bold">
                                {data.score}
                            </p>

                            <MaterialSymbolsStarRounded className="text-lg text-yellow-400" />
                        </div>

                        <p className="text-xs tracking-wider text-muted-foreground">
                            {compact(data.scored_by)} оцінок
                        </p>
                    </div>
                </div>
            )}

            {!!data.score && !!data.native_score && (
                <Separator orientation="vertical" className="h-8" />
            )}

            {!!data.native_score && (
                <div className="flex gap-4 items-center justify-center flex-1">
                    <Hikka className="w-4 h-4 shrink-0" />
                    <div className="flex flex-col items-start justify-start">
                        <div className="flex items-center gap-1">
                            <p className="font-display font-bold">
                                {data.native_score}
                            </p>

                            <MaterialSymbolsStarRounded className="text-lg text-yellow-400" />
                        </div>
                        <p className="text-xs tracking-wider text-muted-foreground">
                            {compact(data.native_scored_by)} оцінок
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scores;
