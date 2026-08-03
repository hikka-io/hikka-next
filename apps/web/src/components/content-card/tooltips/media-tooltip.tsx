import { type FC, memo, type PropsWithChildren, type ReactNode } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    type AnimeInfoResponse,
    animeSlugOptions,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type MangaInfoResponse,
    mangaInfoOptions,
    type NovelInfoResponse,
    novelInfoOptions,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    type WatchResponseBase,
} from '@hikka/api';

import {
    ReadlistButton,
    TrackingButtonsGroup,
    WatchlistButton,
} from '@/components/action-buttons';
import { useSession } from '@/features/auth/hooks/use-session';
import { useTitle } from '@/features/auth/hooks/use-title';
import {
    ANIME_MEDIA_TYPE,
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
} from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

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

/**
 * One query per type rather than one options record indexed by it: `useQuery`
 * cannot unify a union of the generated option objects, and gating each on the
 * type keeps them individually typed. Only the matching one ever runs.
 */
function useMediaInfo(
    type: MainContentTypeEnum,
    slug: string,
    enabled: boolean,
): MediaBody | undefined {
    const anime = useQuery({
        ...animeSlugOptions({ path: { slug } }),
        enabled: enabled && type === ContentTypeEnum.ANIME,
    });
    const manga = useQuery({
        ...mangaInfoOptions({ path: { slug } }),
        enabled: enabled && type === ContentTypeEnum.MANGA,
    });
    const novel = useQuery({
        ...novelInfoOptions({ path: { slug } }),
        enabled: enabled && type === ContentTypeEnum.NOVEL,
    });

    return anime.data ?? manga.data ?? novel.data;
}

const MEDIA_TYPE_MAP: Record<
    MainContentTypeEnum,
    Record<string, { title_ua: string }>
> = {
    [ContentTypeEnum.ANIME]: ANIME_MEDIA_TYPE,
    [ContentTypeEnum.MANGA]: MANGA_MEDIA_TYPE,
    [ContentTypeEnum.NOVEL]: NOVEL_MEDIA_TYPE,
};

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
    title: string;
    item?: MediaTooltipItemOf<'anime'>;
    content?: AnimeInfoResponse | MediaTooltipItemOf<'anime'>;
    watch?: WatchResponseBase | null;
}> = ({ slug, title, item, content, watch }) =>
    item && ('watch' in item || watch !== undefined) ? (
        <TrackingButtonsGroup
            title={title}
            size="default"
            type={ContentTypeEnum.ANIME}
            item={item}
            watch={watch}
        />
    ) : (
        <WatchlistButton slug={slug} watch={watch} anime={content} />
    );

const ReadAction: FC<{
    type: ReadContentTypeEnum;
    slug: string;
    title: string;
    item?: MediaTooltipItemOf<'manga'> | MediaTooltipItemOf<'novel'>;
    content?:
        | MangaInfoResponse
        | NovelInfoResponse
        | MediaTooltipItemOf<'manga'>
        | MediaTooltipItemOf<'novel'>;
    read?: ReadResponseBase | null;
}> = ({ type, slug, title, item, content, read }) => {
    if (item && ('read' in item || read !== undefined)) {
        return item.data_type === 'manga' ? (
            <TrackingButtonsGroup
                title={title}
                size="default"
                type={ContentTypeEnum.MANGA}
                item={item}
                read={read}
            />
        ) : (
            <TrackingButtonsGroup
                title={title}
                size="default"
                type={ContentTypeEnum.NOVEL}
                item={item}
                read={read}
            />
        );
    }

    return (
        <ReadlistButton
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
    const fetched = useMediaInfo(type, slug, !item);
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
            media_type_label={
                data.media_type
                    ? MEDIA_TYPE_MAP[type][data.media_type]?.title_ua
                    : null
            }
            status={data.status}
            genres={data.genres}
            genreBasePath={CONTENT_TYPE_LINKS[type]}
            progressRows={progressRows(data)}
            actionButton={
                loggedUser ? (
                    type === ContentTypeEnum.ANIME ? (
                        <WatchAction
                            slug={slug}
                            title={title}
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
                            title={title}
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
