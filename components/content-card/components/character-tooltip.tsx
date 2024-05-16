'use client';

import * as React from 'react';
import { FC, PropsWithChildren, memo } from 'react';

import Link from 'next/link';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import H5 from '@/components/typography/h5';
import { Badge } from '@/components/ui/badge';
import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import WatchListButton from '@/components/watchlist-button/watchlist-button';
import ContentCard from '@/components/content-card/content-card';

import useCharacterInfo from '@/services/hooks/characters/useCharacterInfo';
import useCharacterAnime from '@/services/hooks/characters/useCharacterAnime';
import useSession from '@/services/hooks/auth/useSession';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';

interface TooltipDataProps {
    slug: string;
}

interface Props extends PropsWithChildren {
    slug?: string;
    withTrigger?: boolean;
}

const TooltipData: FC<TooltipDataProps> = ({ slug }) => {
    const { user: loggedUser } = useSession();
    const { data } = useCharacterInfo({ slug });
    const anime = useCharacterAnime({ slug });
    anime?.list?.sort((a, b) => b.anime.score - a.anime.score)

    if (!data) {
        return (
            <div className="flex w-96 gap-4 text-left animate-pulse">
                <div className="w-18 sm:w-20">
                    <div className="h-20 flex-1 rounded-lg bg-secondary/60" />
                </div>
                <div className="flex w-full flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex w-full flex-1 flex-col gap-2">
                            <div className="h-5 w-20 rounded-lg bg-secondary/60" />
                            <div className="h-3 w-full rounded-lg bg-secondary/60" />
                            <div className="h-3 w-full rounded-lg bg-secondary/60" />
                            <div className="h-3 w-full rounded-lg bg-secondary/60" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-2 flex-col gap-2">
                    <div className="h-4 w-10 rounded-lg bg-secondary/60" />
                    <div className="flex-1 rounded-lg bg-secondary/60" />
                </div>
            </div>); 
    }

    return (
        <>
            {data.description_ua && anime.list ? (
                <div className="flex w-96 gap-4 text-left">
                    <div className="w-18 sm:w-20">
                        <ContentCard poster={data.image} containerRatio={0.7} href={'/characters/' + data.slug}/>
                    </div>
                    <div className="flex w-full flex-1 flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Label className="line-clamp-2 font-bold">
                                {data.name_ua || data.name_en || data.name_ja}
                            </Label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <MDViewer className="break-normal whitespace-normal lmb-3 text-sm text-muted-foreground md:line-clamp-4">
                                    {data.description_ua}
                                </MDViewer>
                            </div>
                        </div>
                    </div>
                    {(anime.list[0] && (
                        <div className="flex flex-2 flex-col gap-2">
                            <Label className="text-muted-foreground">
                                Аніме
                            </Label>
                            <ContentCard 
                                poster={anime.list[0].anime.poster} containerRatio={0.7} 
                                href={'/anime/' + anime.list[0].anime.slug}
                            />
                        </div>
                    ))}
                </div>) 
            :(
                <div className="flex w-min gap-4 text-left">
                    <div className="flex w-min flex-1 flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-18 sm:w-20">
                                <ContentCard poster={data.image} containerRatio={0.7} href={'/characters/' + data.slug}/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="line-clamp-2 font-bold">
                                {data.name_ua || data.name_en || data.name_ja}
                            </Label>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const CharacterTooltip: FC<Props> = ({ slug, children, withTrigger, ...props }) => {
    if (!slug) {
        return null;
    }

    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent
                    side="right"
                    className="hidden min-w-min flex-col gap-4 p-4 md:flex"
                >
                    <HoverCardArrow />
                    <TooltipData slug={slug} />
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );
};

export default memo(CharacterTooltip);
