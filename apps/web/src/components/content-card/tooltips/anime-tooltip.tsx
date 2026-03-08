'use client';

import { WatchResponseBase } from '@hikka/client';
import { useAnimeBySlug, useSession } from '@hikka/react';
import { FC, PropsWithChildren, memo } from 'react';

import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

import { WatchlistButton } from '@/features/common';

import HoverCardWrapper from './hover-card-wrapper';
import MediaTooltipContent from './media-tooltip-content';
import { MediaTooltipSkeleton } from './tooltip-skeleton';

interface TooltipDataProps {
    slug: string;
    watch?: WatchResponseBase;
}

interface Props extends PropsWithChildren {
    slug?: string;
    watch?: WatchResponseBase;
}

const TooltipData: FC<TooltipDataProps> = ({ slug, watch }) => {
    const { user: loggedUser } = useSession();
    const { data } = useAnimeBySlug({ slug });

    if (!data) {
        return <MediaTooltipSkeleton />;
    }

    return (
        <MediaTooltipContent
            title={data.title}
            score={data.score}
            synopsis_ua={data.synopsis_ua}
            synopsis_en={data.synopsis_en}
            media_type_label={
                data.media_type
                    ? ANIME_MEDIA_TYPE[data.media_type].title_ua
                    : null
            }
            status={data.status}
            genres={data.genres}
            genreBasePath="/anime"
            progressContent={
                data.media_type !== 'movie' &&
                data.episodes_total &&
                data.episodes_released !== null ? (
                    <div className="flex">
                        <div className="w-1/4">
                            <span className="text-sm font-medium leading-tight text-muted-foreground">
                                Епізоди:
                            </span>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-medium leading-tight">
                                {data.status === 'finished'
                                    ? data.episodes_total
                                    : `${data.episodes_released} / ${data.episodes_total}`}
                            </span>
                        </div>
                    </div>
                ) : undefined
            }
            actionButton={
                loggedUser ? (
                    <WatchlistButton watch={watch} slug={slug} additional />
                ) : undefined
            }
        />
    );
};

const AnimeTooltip: FC<Props> = ({ slug, children, watch }) => {
    if (!slug) {
        return null;
    }

    return (
        <HoverCardWrapper
            content={<TooltipData slug={slug} watch={watch} />}
        >
            {children}
        </HoverCardWrapper>
    );
};

export default memo(AnimeTooltip);
