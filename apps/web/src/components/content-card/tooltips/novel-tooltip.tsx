import { type FC, memo, type PropsWithChildren } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    ContentTypeEnum,
    type NovelResponseWithRead,
    novelInfoOptions,
    type ReadResponseBase,
} from '@hikka/api';

import {
    ReadlistButton,
    TrackingButtonsGroup,
} from '@/components/action-buttons';
import { useSession } from '@/features/auth/hooks/use-session';
import { useTitle } from '@/features/auth/hooks/use-title';
import { NOVEL_MEDIA_TYPE } from '@/utils/constants/common';

import { getTooltipItem } from '../utils';
import HoverCardWrapper from './hover-card-wrapper';
import MediaTooltipContent from './media-tooltip-content';
import { MediaTooltipSkeleton } from './tooltip-skeleton';
import type { MediaTooltipItem } from './types';

type TooltipDataProps = {
    slug: string;
    read?: ReadResponseBase | null;
    item?: NovelResponseWithRead;
};

type Props = PropsWithChildren & {
    slug?: string;
    read?: ReadResponseBase | null;
    item?: MediaTooltipItem;
};

const TooltipData: FC<TooltipDataProps> = ({ slug, read, item }) => {
    const { user: loggedUser } = useSession();
    const { data: fetched } = useQuery({
        ...novelInfoOptions({ path: { slug } }),
        enabled: !item,
    });
    const data = item ?? fetched;
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
                    ? NOVEL_MEDIA_TYPE[
                          data.media_type as keyof typeof NOVEL_MEDIA_TYPE
                      ].title_ua
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
                    item ? (
                        <TrackingButtonsGroup
                            title={title}
                            size="default"
                            type={ContentTypeEnum.NOVEL}
                            item={item}
                        />
                    ) : (
                        <ReadlistButton
                            slug={slug}
                            content_type={ContentTypeEnum.NOVEL}
                            read={read}
                        />
                    )
                ) : undefined
            }
        />
    );
};

const NovelTooltip: FC<Props> = ({ slug, children, read, item }) => {
    if (!slug) {
        return null;
    }

    return (
        <HoverCardWrapper
            content={
                <TooltipData
                    slug={slug}
                    read={read}
                    item={getTooltipItem(item, 'novel')}
                />
            }
        >
            {children}
        </HoverCardWrapper>
    );
};

export default memo(NovelTooltip);
