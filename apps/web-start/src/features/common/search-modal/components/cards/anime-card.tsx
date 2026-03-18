'use client';

import { AnimeResponse } from '@hikka/client';
import * as React from 'react';

import ContentCard from '@/components/content-card/content-card';
import { MaterialSymbolsStarRounded } from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/cn';
import { ANIME_MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants/common';
import { Link } from '@/utils/navigation';

interface Props {
    anime: AnimeResponse;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const AnimeCard = ({ anime, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            to={'/anime/' + anime.slug}
            onClick={onClick}
            className="flex w-full items-start gap-4 text-left"
        >
            <div className="w-12 sm:w-16">
                <ContentCard image={anime.image} />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {anime.title}{' '}
                        <Label className="text-muted-foreground">
                            / {anime.title_ja}
                        </Label>
                    </Label>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {anime.year && (
                            <>
                                <Label className="text-xs text-muted-foreground">
                                    {anime.year}
                                </Label>
                                <div className="size-1 rounded-full bg-muted-foreground" />
                            </>
                        )}

                        {anime.media_type && (
                            <>
                                <Label className="text-xs text-muted-foreground">
                                    {
                                        ANIME_MEDIA_TYPE[anime.media_type]
                                            .title_ua
                                    }
                                </Label>
                                <div className="size-1 rounded-full bg-muted-foreground" />
                            </>
                        )}

                        {anime.status && (
                            <Badge
                                variant="status"
                                className={cn(
                                    `bg-${anime.status} text-${anime.status}-foreground border-${anime.status}-border`,
                                )}
                            >
                                {RELEASE_STATUS[anime.status].title_ua}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
            {anime.score > 0 && (
                <Badge variant="outline" className="gap-1">
                    {anime.score}
                    <MaterialSymbolsStarRounded className="text-yellow-400 size-4" />
                </Badge>
            )}
        </Comp>
    );
};

export default AnimeCard;
