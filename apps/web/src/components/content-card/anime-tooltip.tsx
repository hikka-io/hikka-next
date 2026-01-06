'use client';

import { ContentTypeEnum, WatchResponseBase } from '@hikka/client';
import { useAnimeBySlug, useMangaBySlug, useSession } from '@hikka/react';
import { FC, PropsWithChildren, memo } from 'react';

import { Badge } from '@/components/ui/badge';
import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/cn';
import { ANIME_MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants/common';

import { useSettingsStore } from '@/services/stores/settings-store';

import MDViewer from '../markdown/viewer/MD-viewer';
import H5 from '../typography/h5';
import WatchListButton from '../watchlist-button/watchlist-button';

interface TooltipDataProps {
    slug: string;
    watch?: WatchResponseBase;
    type?: ContentTypeEnum;
}

interface Props extends PropsWithChildren {
    slug?: string;
    withTrigger?: boolean;
    watch?: WatchResponseBase;
    type?: ContentTypeEnum;
}

const TooltipData: FC<TooltipDataProps> = ({ slug, watch, type = ContentTypeEnum.ANIME }) => {
    const { user: loggedUser } = useSession();

    // Вибираємо потрібний хук залежно від типу контенту
    const animeQuery = useAnimeBySlug({ slug, enabled: type === ContentTypeEnum.ANIME });
    const mangaQuery = useMangaBySlug({ slug, enabled: type === ContentTypeEnum.MANGA });

    const data = type === ContentTypeEnum.MANGA ? mangaQuery.data : animeQuery.data;

    const secondaryTitleLanguage = useSettingsStore((state) => state.secondaryTitleLanguage);

    if (!data) {
        return (
            <div className="flex animate-pulse flex-col gap-4">
                <div className="flex justify-between gap-2">
                    <div className="h-4 flex-1 rounded-lg bg-secondary/20" />
                    <div className="h-4 w-10 rounded-lg bg-secondary/20" />
                </div>
                <div className="flex flex-col gap-2 py-3">
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-1/3 rounded-lg bg-secondary/20" />
                </div>
            </div>
        );
    }

    const getSecondaryTitle = () => {
        if (secondaryTitleLanguage === 'none') return null;

        if (secondaryTitleLanguage === 'en') {
            return data.title_en || (data as any).title_romaji || null;
        }

        if (secondaryTitleLanguage === 'ja') {
            return data.title_ja || (data as any).title_original || null;
        }

        return null;
    };

    const secondaryTitle = getSecondaryTitle();
    const synopsis = data.synopsis_ua || data.synopsis_en;

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between gap-2">
                        <H5>{data.title}</H5>
                        {data.score > 0 && (
                            <div className="size-fit rounded-md border bg-secondary/20 backdrop-blur px-2 text-sm">
                                {data.score}
                            </div>
                        )}
                    </div>
                    {secondaryTitle && secondaryTitle !== data.title && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                            {secondaryTitle}
                        </span>
                    )}
                </div>

                {synopsis && (
                    <MDViewer className="mb-2 line-clamp-4 text-sm text-muted-foreground">
                        {synopsis}
                    </MDViewer>
                )}

                <div className="flex items-center">
                    <div className="w-1/4">
                        <Label className="text-muted-foreground">Тип:</Label>
                    </div>
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {data.media_type && (
                            <Label>
                                {ANIME_MEDIA_TYPE[data.media_type]?.title_ua || data.media_type}
                            </Label>
                        )}
                        {data.status && (
                            <Badge
                                variant="status"
                                className={cn(`bg-${data.status} text-${data.status}-foreground border-${data.status}-border`)}
                            >
                                {RELEASE_STATUS[data.status]?.title_ua || data.status}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {loggedUser && type === ContentTypeEnum.ANIME && (
                <WatchListButton watch={watch} slug={slug} additional />
            )}
        </>
    );
};

const AnimeTooltip: FC<Props> = ({ slug, children, watch, type }) => {
    if (!slug) return <>{children}</>;

    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent
                    side="right"
                    className="hidden w-80 flex-col gap-4 p-4 md:flex"
                >
                    <HoverCardArrow />
                    <TooltipData slug={slug} watch={watch} type={type} />
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );
};

export default memo(AnimeTooltip);
