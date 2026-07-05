import type { ComponentProps, MouseEventHandler } from 'react';

import type {
    AnimeResponse,
    AnimeResponseWithWatch,
    MangaResponseWithRead,
} from '@hikka/api';

import ContentCard from '@/components/content-card/content-card';
import { MaterialSymbolsStarRounded } from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useTitle } from '@/features/auth/hooks/use-title';
import { cn } from '@/utils/cn';
import {
    ANIME_MEDIA_TYPE,
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
    RELEASE_STATUS,
} from '@/utils/constants/common';
import { Link } from '@/utils/navigation';

import type { SearchContent } from '../../types';

export type SearchCardType =
    | 'anime'
    | 'manga'
    | 'novel'
    | 'character'
    | 'person';

type MediaTypeMap = Record<string, { title_ua: string }>;

type CardConfig = {
    href: string;
    subtitleKey: 'title_ja' | 'title_original' | 'name_ja' | 'name_native';
    mediaTypeMap?: MediaTypeMap;
    track?: 'watch' | 'read';
};

const CARD_CONFIG: Record<SearchCardType, CardConfig> = {
    anime: {
        href: '/anime',
        subtitleKey: 'title_ja',
        mediaTypeMap: ANIME_MEDIA_TYPE as MediaTypeMap,
        track: 'watch',
    },
    manga: {
        href: '/manga',
        subtitleKey: 'title_original',
        mediaTypeMap: MANGA_MEDIA_TYPE as MediaTypeMap,
        track: 'read',
    },
    novel: {
        href: '/novel',
        subtitleKey: 'title_original',
        mediaTypeMap: NOVEL_MEDIA_TYPE as MediaTypeMap,
        track: 'read',
    },
    character: { href: '/characters', subtitleKey: 'name_ja' },
    person: { href: '/people', subtitleKey: 'name_native' },
};

type Props = {
    content: SearchContent;
    contentType: SearchCardType;
    onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
};

const SearchCard = ({ content, contentType, onClick, type }: Props) => {
    const config = CARD_CONFIG[contentType];
    const Comp = type === 'button' ? 'button' : Link;
    const title = useTitle(content);

    const subtitle = (
        content as unknown as Record<string, string | null | undefined>
    )[config.subtitleKey];
    const mediaTypeMap = config.mediaTypeMap;
    const isContent = mediaTypeMap !== undefined;
    // `meta` fields (year/media_type/status/score) only exist on the
    // anime/manga/novel responses; guarded by `isContent` before access.
    const meta = content as AnimeResponse;

    const trackItem =
        config.track === 'watch'
            ? (content as AnimeResponseWithWatch).watch?.[0]
            : config.track === 'read'
              ? (content as MangaResponseWithRead).read?.[0]
              : undefined;

    return (
        <Comp
            to={`${config.href}/${content.slug}`}
            onClick={onClick}
            className="flex w-full items-center gap-4 text-left"
        >
            <div className="w-12">
                <ContentCard
                    containerClassName="rounded-(--base-radius)"
                    image={content.image}
                    {...(config.track === 'watch'
                        ? {
                              watch: trackItem as ComponentProps<
                                  typeof ContentCard
                              >['watch'],
                          }
                        : config.track === 'read'
                          ? {
                                read: trackItem as ComponentProps<
                                    typeof ContentCard
                                >['read'],
                            }
                          : {})}
                    {...(isContent ? { statusSize: 'sm' as const } : {})}
                />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label
                        className={cn('font-bold', isContent && 'line-clamp-2')}
                    >
                        {title}{' '}
                        <Label className="text-muted-foreground">
                            / {subtitle}
                        </Label>
                    </Label>
                </div>
                {isContent && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {meta.year && (
                                <>
                                    <Label className="text-muted-foreground text-xs">
                                        {meta.year}
                                    </Label>
                                    <div className="size-1 rounded-full bg-muted-foreground" />
                                </>
                            )}

                            {mediaTypeMap && meta.media_type && (
                                <>
                                    <Label className="text-muted-foreground text-xs">
                                        {
                                            mediaTypeMap[
                                                meta.media_type as string
                                            ].title_ua
                                        }
                                    </Label>
                                    <div className="size-1 rounded-full bg-muted-foreground" />
                                </>
                            )}

                            {meta.status && (
                                <Badge
                                    variant="status"
                                    className={cn(
                                        `bg-${meta.status} text-${meta.status}-foreground border-${meta.status}-border`,
                                    )}
                                >
                                    {
                                        RELEASE_STATUS[
                                            meta.status as keyof typeof RELEASE_STATUS
                                        ].title_ua
                                    }
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {isContent && meta.score > 0 && (
                <Badge variant="outline" className="gap-1">
                    {meta.score}
                    <MaterialSymbolsStarRounded className="size-4 text-yellow-400" />
                </Badge>
            )}
        </Comp>
    );
};

export default SearchCard;
