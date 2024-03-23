'use client';

import * as React from 'react';
import { PropsWithChildren, memo } from 'react';



import Link from 'next/link';



import MDViewer from '@/components/markdown/viewer/MD-viewer';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import { HoverCard, HoverCardArrow, HoverCardContent, HoverCardPortal, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import WatchListButton from '@/components/watchlist-button';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import useAuth from '@/services/hooks/auth/useAuth';

import { useSettingsContext } from '@/services/providers/settings-provider';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';


interface Props extends PropsWithChildren {
    slug?: string;
    withTrigger?: boolean;
}

const TooltipData = ({ slug }: { slug: string }) => {
    const { titleLanguage } = useSettingsContext();
    const { auth } = useAuth();
    const { data } = useAnimeInfo({ slug });

    if (!data) {
        return (
            <div className="flex animate-pulse flex-col gap-4">
                <div className="flex justify-between gap-2">
                    <div className="h-4 flex-1 rounded-lg bg-secondary/60" />
                    <div className="h-4 w-10 rounded-lg bg-secondary/60" />
                </div>
                <div className="flex flex-col gap-2 py-3">
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                    <div className="h-2 w-1/3 rounded-lg bg-secondary/60" />
                </div>
                <div className="flex gap-2">
                    <div className="h-3 w-1/4 rounded-lg bg-secondary/60" />
                    <div className="h-3 flex-1 rounded-lg bg-secondary/60" />
                </div>
                <div className="flex gap-2">
                    <div className="h-3 w-1/4 rounded-lg bg-secondary/60" />
                    <div className="h-3 w-2/4 rounded-lg bg-secondary/60" />
                </div>
                <div className="h-12 w-full rounded-md bg-secondary/60" />
            </div>
        );
    }

    const title =
        data[titleLanguage!] || data.title_ua || data.title_en || data.title_ja;
    const synopsis = data.synopsis_ua || data.synopsis_en;

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                    <H5>{title}</H5>
                    {data.score > 0 ? (
                        <div className="size-fit rounded-md border  border-accent bg-accent px-2 text-sm text-accent-foreground">
                            {data.score}
                        </div>
                    ) : null}
                </div>
                {synopsis && (
                    <MDViewer className="mb-2 line-clamp-4 text-sm">
                        {synopsis}
                    </MDViewer>
                )}
                <div className="flex items-center">
                    <div className="w-1/4">
                        <Label className="text-muted-foreground">Тип:</Label>
                    </div>
                    <div className="flex flex-1 flex-wrap gap-2">
                        {data.media_type && (
                            <Label>
                                {MEDIA_TYPE[data.media_type].title_ua}
                            </Label>
                        )}
                        <div
                            className="w-fit rounded-md px-2 text-sm text-white"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[data.status].color,
                            }}
                        >
                            <P>{RELEASE_STATUS[data.status].title_ua}</P>
                        </div>
                    </div>
                </div>
                {data.media_type !== 'movie' &&
                    data.episodes_total &&
                    data.episodes_released !== null && (
                        <div className="flex">
                            <div className="w-1/4">
                                <Label className="text-muted-foreground">
                                    Епізоди:
                                </Label>
                            </div>
                            <div className="flex-1">
                                <Label>
                                    {data.status === 'finished'
                                        ? data.episodes_total
                                        : `${data.episodes_released} / ${data.episodes_total}`}
                                </Label>
                            </div>
                        </div>
                    )}
                <div className="flex">
                    <div className="w-1/4">
                        <Label className="text-muted-foreground">Жанри:</Label>
                    </div>
                    <div className="flex-1">
                        {data.genres.map((genre, i) => (
                            <span key={genre.slug}>
                                <Link
                                    className="rounded-sm text-sm underline decoration-primary decoration-dashed transition-colors duration-100 hover:bg-primary hover:text-primary-foreground"
                                    href={`/anime?genres=${genre.slug}`}
                                >
                                    {genre.name_ua}
                                </Link>
                                {i + 1 !== data.genres.length && (
                                    <span>, </span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {auth && <WatchListButton slug={slug} additional />}
        </>
    );
};

const Component = ({ slug, children, withTrigger, ...props }: Props) => {
    if (!slug) {
        return null;
    }

    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent
                    side="right"
                    className="hidden w-80 flex-col gap-4 p-4 md:flex"
                >
                    <HoverCardArrow />
                    <TooltipData slug={slug} />
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );
};

export default memo(Component);
