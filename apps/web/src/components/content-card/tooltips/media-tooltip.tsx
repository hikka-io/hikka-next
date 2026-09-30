import { type FC, memo, type PropsWithChildren, type ReactNode } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    type AnimeInfoResponse,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type MangaInfoResponse,
    type NovelInfoResponse,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    type WatchResponseBase,
} from '@hikka/api';

import {
    ReadListButton,
    TrackingButtonsGroup,
    WatchListButton,
} from '@/components/tracking';
import { useSession, useTitle } from '@/services/session';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { getMediaTypeLabel } from '@/utils/labels';

import HoverCardWrapper from './hover-card-wrapper';
import MediaTooltipContent, {
    type MediaTooltipRow,
} from './media-tooltip-content';
import { MediaTooltipSkeleton } from './tooltip-skeleton';
import type { MediaTooltipItem, MediaTooltipItemOf } from './types';

type MediaBody =
    | MediaTooltipItem
    | AnimeInfoResponse
    | MangaInfoResponse
    | NovelInfoResponse;

function progressRows(data: MediaBody): MediaTooltipRow[] {
    if (data.data_type === 'anime') {
        if (
            data.media_type === 'movie' ||
            !data.episodes_total ||
            data.episodes_released === null
        ) {
            return [];
        }

        return [
            {
                label: 'Епізоди',
                value:
                    data.status === 'finished'
                        ? data.episodes_total
                        : `${data.episodes_released} / ${data.episodes_total}`,
            },
        ];
    }

    return [
        data.volumes ? { label: 'Томи', value: data.volumes } : null,
        data.chapters ? { label: 'Розділи', value: data.chapters } : null,
    ].filter((row) => row !== null);
}

/**
 * The inline tracking group needs the viewer's current entry; it arrives either
 * embedded in `item` or as an explicit `watch`/`read` (`null` = untracked).
 * With neither, the status is unknown and the standalone button fetches it.
 */
const WatchAction: FC<{
    slug: string;
    item?: MediaTooltipItemOf<'anime'>;
    content?: AnimeInfoResponse | MediaTooltipItemOf<'anime'>;
    watch?: WatchResponseBase | null;
}> = ({ slug, item, content, watch }) =>
    item && ('watch' in item || watch !== undefined) ? (
        <TrackingButtonsGroup
            size="default"
            type={ContentTypeEnum.ANIME}
            item={item}
            watch={watch}
        />
    ) : (
        <WatchListButton slug={slug} watch={watch} anime={content} />
    );

const ReadAction: FC<{
    type: ReadContentTypeEnum;
    slug: string;
    item?: MediaTooltipItemOf<'manga'> | MediaTooltipItemOf<'novel'>;
    content?:
        | MangaInfoResponse
        | NovelInfoResponse
        | MediaTooltipItemOf<'manga'>
        | MediaTooltipItemOf<'novel'>;
    read?: ReadResponseBase | null;
}> = ({ type, slug, item, content, read }) => {
    if (item && ('read' in item || read !== undefined)) {
        return item.data_type === 'manga' ? (
            <TrackingButtonsGroup
                size="default"
                type={ContentTypeEnum.MANGA}
                item={item}
                read={read}
            />
        ) : (
            <TrackingButtonsGroup
                size="default"
                type={ContentTypeEnum.NOVEL}
                item={item}
                read={read}
            />
        );
    }

    return (
        <ReadListButton
            slug={slug}
            content_type={type}
            read={read}
            content={content}
        />
    );
};

type TooltipDataProps = {
    type: MainContentTypeEnum;
    slug: string;
    watch?: WatchResponseBase | null;
    read?: ReadResponseBase | null;
    item?: MediaTooltipItem;
};

const MediaTooltipData: FC<TooltipDataProps> = ({
    type,
    slug,
    watch,
    read,
    item,
}) => {
    const { user: loggedUser } = useSession();
    const { data: fetched } = useQuery({
        ...contentInfoOptions(type, slug),
        enabled: !item,
    });
    const data: MediaBody | undefined = item ?? fetched;
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
            media_type_label={getMediaTypeLabel(data.media_type)}
            status={data.status}
            genres={data.genres}
            genreBasePath={CONTENT_TYPE_LINKS[type]}
            progressRows={progressRows(data)}
            actionButton={
                loggedUser ? (
                    type === ContentTypeEnum.ANIME ? (
                        <WatchAction
                            slug={slug}
                            item={
                                item?.data_type === 'anime' ? item : undefined
                            }
                            content={
                                data.data_type === 'anime' ? data : undefined
                            }
                            watch={watch}
                        />
                    ) : (
                        <ReadAction
                            type={type}
                            slug={slug}
                            item={
                                item?.data_type === 'anime' ? undefined : item
                            }
                            content={
                                data.data_type === 'anime' ? undefined : data
                            }
                            read={read}
                        />
                    )
                ) : undefined
            }
        />
    );
};

type Props = PropsWithChildren & {
    type: MainContentTypeEnum;
    slug?: string;
    watch?: WatchResponseBase | null;
    read?: ReadResponseBase | null;
    item?: MediaTooltipItem;
};

const MediaTooltip: FC<Props> = ({
    type,
    slug,
    children,
    watch,
    read,
    item,
}) => {
    if (!slug) {
        return children as ReactNode;
    }

    return (
        <HoverCardWrapper
            content={
                <MediaTooltipData
                    type={type}
                    slug={slug}
                    watch={watch}
                    read={read}
                    item={item?.data_type === type ? item : undefined}
                />
            }
        >
            {children}
        </HoverCardWrapper>
    );
};

export default memo(MediaTooltip);
