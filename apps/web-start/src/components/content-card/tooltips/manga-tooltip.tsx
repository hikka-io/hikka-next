import { type FC, memo, type PropsWithChildren } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    ContentTypeEnum,
    mangaInfoOptions,
    type ReadResponseBase,
} from '@hikka/api';

import { ReadlistButton } from '@/components/action-buttons';
import { useSession } from '@/features/auth/hooks/use-session';
import { useTitle } from '@/features/auth/hooks/use-title';
import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';

import HoverCardWrapper from './hover-card-wrapper';
import MediaTooltipContent from './media-tooltip-content';
import { MediaTooltipSkeleton } from './tooltip-skeleton';

type TooltipDataProps = {
    slug: string;
    read?: ReadResponseBase;
};

type Props = PropsWithChildren & {
    slug?: string;
    read?: ReadResponseBase;
};

const TooltipData: FC<TooltipDataProps> = ({ slug, read }) => {
    const { user: loggedUser } = useSession();
    const { data } = useQuery(mangaInfoOptions({ path: { slug } }));
    const title = useTitle(data);

    if (!data) {
        return <MediaTooltipSkeleton />;
    }

    return (
        <MediaTooltipContent
            title={title}
            score={data.score}
            synopsis_ua={data.synopsis_ua}
            synopsis_en={data.synopsis_en}
            media_type_label={
                data.media_type
                    ? MANGA_MEDIA_TYPE[
                          data.media_type as keyof typeof MANGA_MEDIA_TYPE
                      ].title_ua
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
                                <span className="font-medium text-muted-foreground text-sm leading-tight">
                                    Томи:
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="font-medium text-sm leading-tight">
                                    {data.volumes}
                                </span>
                            </div>
                        </div>
                    )}
                    {data.chapters && (
                        <div className="flex">
                            <div className="w-1/4">
                                <span className="font-medium text-muted-foreground text-sm leading-tight">
                                    Розділи:
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="font-medium text-sm leading-tight">
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
        <HoverCardWrapper content={<TooltipData slug={slug} read={read} />}>
            {children}
        </HoverCardWrapper>
    );
};

export default memo(MangaTooltip);
