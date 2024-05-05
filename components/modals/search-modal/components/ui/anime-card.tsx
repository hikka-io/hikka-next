'use client';

import * as React from 'react';
import MaterialSymbolsStarRounded from '~icons/material-symbols/star-rounded';

import Link from 'next/link';

import ContentCard from '@/components/content-card/content-card';
import P from '@/components/typography/p';
import { Badge } from '@/components/ui/badge';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';

import { Label } from '../../../../ui/label';

interface Props {
    anime: API.Anime;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const AnimeCard = ({ anime, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            href={'/anime/' + anime.slug}
            onClick={onClick}
            className="flex w-full items-start gap-4 text-left"
        >
            <div className="w-12 sm:w-16">
                <ContentCard poster={anime.poster} />
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
                        <Label className="text-xs text-muted-foreground">
                            {anime.year}
                        </Label>

                        {anime.media_type && (
                            <>
                                <div className="size-1 rounded-full bg-muted-foreground" />
                                <Label className="text-xs text-muted-foreground">
                                    {MEDIA_TYPE[anime.media_type].title_ua}
                                </Label>
                            </>
                        )}
                        <div className="size-1 rounded-full bg-muted-foreground" />
                        <Badge
                            className="text-xs"
                            variant="status"
                            bgColor={RELEASE_STATUS[anime.status].color}
                        >
                            {RELEASE_STATUS[anime.status].title_ua}
                        </Badge>
                    </div>
                </div>
            </div>
            {anime.score > 0 && (
                <div className="flex items-center gap-1 text-sm">
                    <P className="font-bold leading-normal">{anime.score}</P>
                    <MaterialSymbolsStarRounded className="hidden sm:block" />
                </div>
            )}
        </Comp>
    );
};

export default AnimeCard;
