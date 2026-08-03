import type { FC, ReactNode } from 'react';

import { InlineScores } from '@/components/inline-scores';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { RELEASE_STATUS } from '@/utils/constants/common';
import { Link } from '@/utils/navigation';

import MDViewer from '../../markdown/viewer/md-viewer';

interface GenreItem {
    slug: string;
    name_ua: string | null;
}

export type MediaTooltipRow = {
    label: string;
    value: ReactNode;
};

type Props = {
    title?: string;
    score: number;
    native_score?: number;
    scored_by?: number;
    native_scored_by?: number;
    synopsis_ua?: string | null;
    synopsis_en?: string | null;
    media_type_label?: string | null;
    status?: string | null;
    genres: GenreItem[];
    genreBasePath: string;
    progressRows?: MediaTooltipRow[];
    actionButton?: ReactNode;
};

const TooltipRow: FC<{ label: string; children: ReactNode }> = ({
    label,
    children,
}) => (
    <div className="flex">
        <div className="w-1/4">
            <span className="font-medium text-muted-foreground text-sm leading-tight">
                {label}:
            </span>
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-2">
            {children}
        </div>
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
    progressRows,
    actionButton,
}) => {
    const synopsis = synopsis_ua || synopsis_en;

    return (
        <>
            <div className="flex flex-col gap-2">
                <h5>{title}</h5>
                <InlineScores
                    malScore={score}
                    malScoreCount={scored_by}
                    hikkaScore={native_score}
                    hikkaScoreCount={native_scored_by}
                />
                {synopsis && (
                    <MDViewer className="mb-2 line-clamp-4 text-muted-foreground text-sm">
                        {synopsis}
                    </MDViewer>
                )}
                <TooltipRow label="Тип">
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
                </TooltipRow>
                {progressRows?.map((row) => (
                    <TooltipRow key={row.label} label={row.label}>
                        <span className="font-medium text-sm leading-tight">
                            {row.value}
                        </span>
                    </TooltipRow>
                ))}
                <TooltipRow label="Жанри">
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
                </TooltipRow>
            </div>
            {actionButton}
        </>
    );
};

export default MediaTooltipContent;
