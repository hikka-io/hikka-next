import { Link } from '@tanstack/react-router';
import { FC, ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';

import { cn } from '@/utils/cn';
import { RELEASE_STATUS } from '@/utils/constants/common';

import MDViewer from '../../markdown/viewer/MD-viewer';

interface GenreItem {
    slug: string;
    name_ua: string | null;
}

interface Props {
    title?: string;
    score: number;
    synopsis_ua?: string | null;
    synopsis_en?: string | null;
    media_type?: string | null;
    media_type_label?: string | null;
    status?: string | null;
    genres: GenreItem[];
    genreBasePath: string;
    progressContent?: ReactNode;
    actionButton?: ReactNode;
}

const MediaTooltipContent: FC<Props> = ({
    title,
    score,
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
                <div className="flex justify-between gap-2">
                    <h5>{title}</h5>
                    {score > 0 ? (
                        <div className="size-fit rounded-md border bg-secondary/20 px-2 text-sm backdrop-blur">
                            {score}
                        </div>
                    ) : null}
                </div>
                {synopsis && (
                    <MDViewer className="mb-2 line-clamp-4 text-sm text-muted-foreground">
                        {synopsis}
                    </MDViewer>
                )}
                <div className="flex items-center">
                    <div className="w-1/4">
                        <span className="text-sm font-medium leading-tight text-muted-foreground">
                            Тип:
                        </span>
                    </div>
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {media_type_label && (
                            <span className="text-sm font-medium leading-tight">
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
                        <span className="text-sm font-medium leading-tight text-muted-foreground">
                            Жанри:
                        </span>
                    </div>
                    <div className="flex-1">
                        {genres.map((genre, i) => (
                            <span key={genre.slug}>
                                <Link
                                    className="text-sm underline decoration-primary-foreground decoration-dashed transition-colors duration-100 hover:bg-primary-border hover:text-primary-foreground"
                                    to={`${genreBasePath}?genres=${genre.slug}`}
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
