'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useTitle } from '@hikka/react';

import Hikka from '@/components/icons/custom/Hikka';
import MAL from '@/components/icons/custom/MAL';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils/cn';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { Link, useParams } from '@/utils/navigation';

interface TitleProps {
    className?: string;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const Title = ({ className, content_type }: TitleProps) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));
    const title = useTitle(data);

    const compact = (n: number) =>
        new Intl.NumberFormat('en', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(n);

    if (!data) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
                <div>
                    <h2>{title}</h2>

                    <p className="text-muted-foreground text-sm">
                        {data.data_type === ContentTypeEnum.ANIME
                            ? data.title_ja
                            : data.title_original}
                    </p>
                </div>
                {(data.score > 0 || data.native_score > 0) && (
                    <div className="flex gap-2 bg-secondary/20 backdrop-blur px-2 py-1 rounded-md border items-center">
                        {!!data.score && (
                            <div className="flex gap-2 items-center">
                                <MAL className="w-4 h-4 text-foreground" />
                                <div className="flex flex-col items-start justify-start">
                                    <div className="flex items-center gap-1">
                                        <p className="font-display  font-bold">
                                            {data.score}
                                        </p>

                                        <MaterialSymbolsStarRounded className="text-lg text-yellow-400" />
                                    </div>

                                    <p className="text-xs tracking-wider text-muted-foreground">
                                        {compact(data.scored_by)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {!!data.score && !!data.native_score && (
                            <Separator orientation="vertical" className="h-8" />
                        )}

                        {!!data.native_score && (
                            <div className="flex gap-2 items-center">
                                <Hikka className="w-4 h-4 text-foreground" />
                                <div className="flex flex-col items-start justify-start">
                                    <div className="flex items-center gap-1">
                                        <p className="font-display font-bold">
                                            {data.native_score}
                                        </p>

                                        <MaterialSymbolsStarRounded className="text-lg text-yellow-400" />
                                    </div>
                                    <p className="text-xs tracking-wider text-muted-foreground">
                                        {compact(data.native_scored_by)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-2">
                {data.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {data.genres.map((genre) => (
                            <span key={genre.slug} className="text-sm">
                                <Link
                                    className="decoration-primary-foreground hover:bg-primary-border hover:text-primary-foreground rounded px-1 underline decoration-dashed transition-colors duration-100"
                                    to={`/${content_type}`}
                                    search={{ genres: [genre.slug] }}
                                >
                                    {genre.name_ua}
                                </Link>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Title;
