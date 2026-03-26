'use client';

import { MangaResponse } from '@hikka/client';
import { useTitle } from '@hikka/react';
import * as React from 'react';

import ContentCard from '@/components/content-card/content-card';
import { MaterialSymbolsStarRounded } from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/cn';
import { MANGA_MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants/common';
import { Link } from '@/utils/navigation';

interface Props {
    manga: MangaResponse;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const MangaCard = ({ manga, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;
    const title = useTitle(manga);

    return (
        <Comp
            to={'/manga/' + manga.slug}
            onClick={onClick}
            className="flex w-full items-center gap-4 text-left"
        >
            <div className="w-12">
                <ContentCard
                    containerClassName="rounded-(--base-radius)"
                    image={manga.image}
                />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {title}{' '}
                        <Label className="text-muted-foreground">
                            / {manga.title_original}
                        </Label>
                    </Label>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {manga.year && (
                            <>
                                <Label className="text-muted-foreground text-xs">
                                    {manga.year}
                                </Label>
                                <div className="bg-muted-foreground size-1 rounded-full" />
                            </>
                        )}

                        {manga.media_type && (
                            <>
                                <Label className="text-muted-foreground text-xs">
                                    {
                                        MANGA_MEDIA_TYPE[manga.media_type]
                                            .title_ua
                                    }
                                </Label>
                                <div className="bg-muted-foreground size-1 rounded-full" />
                            </>
                        )}

                        {manga.status && (
                            <Badge
                                variant="status"
                                className={cn(
                                    `bg-${manga.status} text-${manga.status}-foreground border-${manga.status}-border`,
                                )}
                            >
                                {RELEASE_STATUS[manga.status].title_ua}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
            {manga.score > 0 && (
                <Badge variant="outline" className="gap-1">
                    {manga.score}
                    <MaterialSymbolsStarRounded className="size-4 text-yellow-400" />
                </Badge>
            )}
        </Comp>
    );
};

export default MangaCard;
