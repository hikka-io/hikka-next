import { type FC, memo, type PropsWithChildren } from 'react';

import { useQuery } from '@tanstack/react-query';

import { animeSlugOptions, type WatchResponseBase } from '@hikka/api';

import { WatchlistButton } from '@/components/action-buttons';
import { useSession } from '@/features/auth/hooks/use-session';
import { useTitle } from '@/features/auth/hooks/use-title';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

import HoverCardWrapper from './hover-card-wrapper';
import MediaTooltipContent from './media-tooltip-content';
import { MediaTooltipSkeleton } from './tooltip-skeleton';

type TooltipDataProps = {
    slug: string;
    watch?: WatchResponseBase;
};

type Props = PropsWithChildren & {
    slug?: string;
    watch?: WatchResponseBase;
};

const TooltipData: FC<TooltipDataProps> = ({ slug, watch }) => {
    const { user: loggedUser } = useSession();
    const { data } = useQuery(animeSlugOptions({ path: { slug } }));
    const title = useTitle(data);

    if (!data) {
        return <MediaTooltipSkeleton />;
    }

    return (
        <MediaTooltipContent
            title={title}
            score={data.score}
            native_score={data.native_score}
            scored_by={data.scored_by}
            native_scored_by={data.native_scored_by}
            synopsis_ua={data.synopsis_ua}
            synopsis_en={data.synopsis_en}
            media_type_label={
                data.media_type
                    ? ANIME_MEDIA_TYPE[
                          data.media_type as keyof typeof ANIME_MEDIA_TYPE
                      ].title_ua
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
                            <span className="font-medium text-muted-foreground text-sm leading-tight">
                                Епізоди:
                            </span>
                        </div>
                        <div className="flex-1">
                            <span className="font-medium text-sm leading-tight">
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
                    <WatchlistButton watch={watch} slug={slug} />
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
        <HoverCardWrapper content={<TooltipData slug={slug} watch={watch} />}>
            {children}
        </HoverCardWrapper>
    );
};

export default memo(AnimeTooltip);
