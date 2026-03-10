'use client';

import { ContentTypeEnum, ReadResponseBase } from '@hikka/client';
import { useMangaBySlug, useSession } from '@hikka/react';
import { FC, PropsWithChildren, memo } from 'react';

import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';

import { ReadlistButton } from '@/features/common';

import HoverCardWrapper from './hover-card-wrapper';
import MediaTooltipContent from './media-tooltip-content';
import { MediaTooltipSkeleton } from './tooltip-skeleton';

interface TooltipDataProps {
    slug: string;
    read?: ReadResponseBase;
}

interface Props extends PropsWithChildren {
    slug?: string;
    read?: ReadResponseBase;
}

const TooltipData: FC<TooltipDataProps> = ({ slug, read }) => {
    const { user: loggedUser } = useSession();
    const { data } = useMangaBySlug({ slug });

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
                    ? MANGA_MEDIA_TYPE[data.media_type].title_ua
                    : null
            }
            status={data.status}
            genres={data.genres}
            genreBasePath="/manga"
            progressContent={
                <>
                    {data.volumes && (
                        <div className="flex">
                            <div className="w-1/4">
                                <span className="text-sm font-medium leading-tight text-muted-foreground">
                                    Томи:
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-medium leading-tight">
                                    {data.volumes}
                                </span>
                            </div>
                        </div>
                    )}
                    {data.chapters && (
                        <div className="flex">
                            <div className="w-1/4">
                                <span className="text-sm font-medium leading-tight text-muted-foreground">
                                    Розділи:
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-medium leading-tight">
                                    {data.chapters}
                                </span>
                            </div>
                        </div>
                    )}
                </>
            }
            actionButton={
                loggedUser ? (
                    <ReadlistButton
                        slug={slug}
                        content_type={ContentTypeEnum.MANGA}
                        read={read}
                    />
                ) : undefined
            }
        />
    );
};

const MangaTooltip: FC<Props> = ({ slug, children, read }) => {
    if (!slug) {
        return null;
    }

    return (
        <HoverCardWrapper
            content={<TooltipData slug={slug} read={read} />}
        >
            {children}
        </HoverCardWrapper>
    );
};

export default memo(MangaTooltip);
