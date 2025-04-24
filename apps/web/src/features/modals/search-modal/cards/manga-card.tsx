'use client';

import { MangaResponse } from '@hikka/client';
import Link from 'next/link';
import * as React from 'react';

import ContentCard from '@/components/content-card/content-card';
import { MaterialSymbolsStarRounded } from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import P from '@/components/typography/p';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { MANGA_MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants/common';

interface Props {
    manga: MangaResponse;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const MangaCard = ({ manga, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            href={'/manga/' + manga.slug}
            onClick={onClick}
            className="flex w-full items-start gap-4 text-left"
        >
            <div className="w-12 sm:w-16">
                <ContentCard image={manga.image} />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {manga.title}{' '}
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
                                className="text-xs"
                                variant="status"
                                bgColor={RELEASE_STATUS[manga.status].color}
                            >
                                {RELEASE_STATUS[manga.status].title_ua}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
            {manga.score > 0 && (
                <div className="flex items-center gap-1 text-sm">
                    <P className="font-bold leading-normal">{manga.score}</P>
                    <MaterialSymbolsStarRounded className="hidden sm:block" />
                </div>
            )}
        </Comp>
    );
};

export default MangaCard;
