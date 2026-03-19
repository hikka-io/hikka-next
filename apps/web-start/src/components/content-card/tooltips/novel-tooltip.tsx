'use client';

import { ContentTypeEnum, ReadResponseBase } from '@hikka/client';
import { useNovelBySlug, useSession } from '@hikka/react';
import { FC, PropsWithChildren, memo } from 'react';

import { ReadlistButton } from '@/features/common';

import { NOVEL_MEDIA_TYPE } from '@/utils/constants/common';

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
    const { data } = useNovelBySlug({ slug });

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
                    ? NOVEL_MEDIA_TYPE[data.media_type].title_ua
                    : null
            }
            status={data.status}
            genres={data.genres}
            genreBasePath="/novel"
            progressContent={
                <>
                    {data.volumes && (
                        <div className="flex">
                            <div className="w-1/4">
                                <span className="text-muted-foreground text-sm leading-tight font-medium">
                                    Томи:
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm leading-tight font-medium">
                                    {data.volumes}
                                </span>
                            </div>
                        </div>
                    )}
                    {data.chapters && (
                        <div className="flex">
                            <div className="w-1/4">
                                <span className="text-muted-foreground text-sm leading-tight font-medium">
                                    Розділи:
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm leading-tight font-medium">
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
                        content_type={ContentTypeEnum.NOVEL}
                        read={read}
                    />
                ) : undefined
            }
        />
    );
};

const NovelTooltip: FC<Props> = ({ slug, children, read }) => {
    if (!slug) {
        return null;
    }

    return (
        <HoverCardWrapper content={<TooltipData slug={slug} read={read} />}>
            {children}
        </HoverCardWrapper>
    );
};

export default memo(NovelTooltip);
