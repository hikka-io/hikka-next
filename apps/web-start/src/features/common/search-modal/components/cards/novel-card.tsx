'use client';

import { NovelResponse } from '@hikka/client';
import * as React from 'react';

import ContentCard from '@/components/content-card/content-card';
import { MaterialSymbolsStarRounded } from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/cn';
import { NOVEL_MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants/common';
import { Link } from '@/utils/navigation';

interface Props {
    novel: NovelResponse;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const NovelCard = ({ novel, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            to={'/novel/' + novel.slug}
            onClick={onClick}
            className="flex w-full items-center gap-4 text-left"
        >
            <div className="w-12">
                <ContentCard image={novel.image} />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {novel.title}{' '}
                        <Label className="text-muted-foreground">
                            / {novel.title_original}
                        </Label>
                    </Label>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {novel.year && (
                            <>
                                <Label className="text-xs text-muted-foreground">
                                    {novel.year}
                                </Label>
                                <div className="size-1 rounded-full bg-muted-foreground" />
                            </>
                        )}

                        {novel.media_type && (
                            <>
                                <Label className="text-xs text-muted-foreground">
                                    {
                                        NOVEL_MEDIA_TYPE[novel.media_type]
                                            .title_ua
                                    }
                                </Label>
                                <div className="size-1 rounded-full bg-muted-foreground" />
                            </>
                        )}

                        {novel.status && (
                            <Badge
                                variant="status"
                                className={cn(
                                    `bg-${novel.status} text-${novel.status}-foreground border-${novel.status}-border`,
                                )}
                            >
                                {RELEASE_STATUS[novel.status].title_ua}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
            {novel.score > 0 && (
                <Badge variant="outline" className="gap-1">
                    {novel.score}
                    <MaterialSymbolsStarRounded className="text-yellow-400 size-4" />
                </Badge>
            )}
        </Comp>
    );
};

export default NovelCard;
