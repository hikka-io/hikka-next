'use client';

import Link from 'next/link';
import * as React from 'react';
import MaterialSymbolsStarRounded from '~icons/material-symbols/star-rounded';

import ContentCard from '@/components/content-card/content-card';
import P from '@/components/typography/p';
import { Badge } from '@/components/ui/badge';

import { NOVEL_MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';

import { Label } from '../../../../components/ui/label';

interface Props {
    novel: API.Novel;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const NovelCard = ({ novel, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            href={'/novel/' + novel.slug}
            onClick={onClick}
            className="flex w-full items-start gap-4 text-left"
        >
            <div className="w-12 sm:w-16">
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
                        <Label className="text-xs text-muted-foreground">
                            {novel.year}
                        </Label>

                        {novel.media_type && (
                            <>
                                <div className="size-1 rounded-full bg-muted-foreground" />
                                <Label className="text-xs text-muted-foreground">
                                    {
                                        NOVEL_MEDIA_TYPE[novel.media_type]
                                            .title_ua
                                    }
                                </Label>
                            </>
                        )}
                        <div className="size-1 rounded-full bg-muted-foreground" />
                        <Badge
                            className="text-xs"
                            variant="status"
                            bgColor={RELEASE_STATUS[novel.status].color}
                        >
                            {RELEASE_STATUS[novel.status].title_ua}
                        </Badge>
                    </div>
                </div>
            </div>
            {novel.score > 0 && (
                <div className="flex items-center gap-1 text-sm">
                    <P className="font-bold leading-normal">{novel.score}</P>
                    <MaterialSymbolsStarRounded className="hidden sm:block" />
                </div>
            )}
        </Comp>
    );
};

export default NovelCard;
