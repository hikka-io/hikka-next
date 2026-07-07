import type { FC, ReactNode } from 'react';

import Hikka from '@/components/icons/custom/Hikka';
import MAL from '@/components/icons/custom/MAL';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { RELEASE_STATUS } from '@/utils/constants/common';
import { Link } from '@/utils/navigation';

import MDViewer from '../../markdown/viewer/md-viewer';

interface GenreItem {
    slug: string;
    name_ua: string | null;
}

type Props = {
    title?: string;
    score: number;
    native_score?: number;
    scored_by?: number;
    native_scored_by?: number;
    synopsis_ua?: string | null;
    synopsis_en?: string | null;
    media_type?: string | null;
    media_type_label?: string | null;
    status?: string | null;
    genres: GenreItem[];
    genreBasePath: string;
    progressContent?: ReactNode;
    actionButton?: ReactNode;
};

const compact = (n: number) =>
    new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(n);

const ScoreSource: FC<{
    icon: ReactNode;
    score: number;
    scoredBy?: number;
}> = ({ icon, score, scoredBy }) => (
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

const MediaTooltipContent: FC<Props> = ({
    title,
    score,
    native_score,
    scored_by,
    native_scored_by,
    synopsis_ua,
    synopsis_en,
    media_type_label,
    status,
    genres,
    genreBasePath,
    progressContent,
    actionButton,
}) => {
    const synopsis = synopsis_ua || synopsis_en;

    return (
        <>
            <div className="flex flex-col gap-2">
                <h5>{title}</h5>
                {(score > 0 || (native_score ?? 0) > 0) && (
                    <div className="flex items-center gap-3">
                        {score > 0 && (
                            <ScoreSource
                                icon={
                                    <MAL className="h-4 w-4 text-foreground" />
                                }
                                score={score}
                                scoredBy={scored_by}
                            />
                        )}
                        {score > 0 && (native_score ?? 0) > 0 && (
                            <Separator orientation="vertical" className="h-5" />
                        )}
                        {(native_score ?? 0) > 0 && (
                            <ScoreSource
                                icon={<Hikka className="h-4 w-4 shrink-0" />}
                                score={native_score as number}
                                scoredBy={native_scored_by}
                            />
                        )}
                    </div>
                )}
                {synopsis && (
                    <MDViewer className="mb-2 line-clamp-4 text-muted-foreground text-sm">
                        {synopsis}
                    </MDViewer>
                )}
                <div className="flex items-center">
                    <div className="w-1/4">
                        <span className="font-medium text-muted-foreground text-sm leading-tight">
                            Тип:
                        </span>
                    </div>
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {media_type_label && (
                            <span className="font-medium text-sm leading-tight">
                                {media_type_label}
                            </span>
                        )}
                        {status && (
                            <Badge
                                variant="status"
                                className={cn(
                                    `bg-${status} text-${status}-foreground border-${status}-border`,
                                )}
                            >
                                {
                                    RELEASE_STATUS[
                                        status as keyof typeof RELEASE_STATUS
                                    ]?.title_ua
                                }
                            </Badge>
                        )}
                    </div>
                </div>
                {progressContent}
                <div className="flex">
                    <div className="w-1/4">
                        <span className="font-medium text-muted-foreground text-sm leading-tight">
                            Жанри:
                        </span>
                    </div>
                    <div className="flex-1">
                        {genres.map((genre, i) => (
                            <span key={genre.slug}>
                                <Link
                                    className="text-sm underline decoration-primary-foreground decoration-dashed transition-colors duration-100 hover:bg-primary-border hover:text-primary-foreground"
                                    to={genreBasePath}
                                    search={{ genres: [genre.slug] }}
                                >
                                    {genre.name_ua}
                                </Link>
                                {i + 1 !== genres.length && <span>, </span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            {actionButton}
        </>
    );
};

export default MediaTooltipContent;
