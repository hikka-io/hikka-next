import type { FC } from 'react';

import { range } from '@antfu/utils';

import { ContentTypeEnum, type SeasonEnum } from '@hikka/api';
import { EPISODE_FORMS, getDeclensionWord } from '@hikka/core';

import { MediaTooltip } from '@/components/content-card';
import AnimeCard from '@/components/content-card/anime-card';
import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import PosterCard from '@/components/content-card/poster-card';
import SkeletonCard from '@/components/content-card/poster-card-skeleton';
import MaterialSymbolsLiveTvRounded from '@/components/icons/material-symbols/MaterialSymbolsLiveTvRounded';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import BlockBleed from '@/components/ui/block-bleed';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Skeleton } from '@/components/ui/skeleton';
import Stack from '@/components/ui/stack';
import { useSessionUI } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';
import { getCurrentSeason } from '@/utils/season';
import { getTitle } from '@/utils/title/get-title';

import { homeOngoingsOptions, ONGOINGS_SIZE } from '../queries';
import type { WidgetProps } from '../types';

const OngoingItemSkeleton = () => (
    <div className="flex items-center gap-4 px-4 py-2">
        <div className="w-12 shrink-0">
            <AspectRatio ratio={DEFAULT_CONTAINER_RATIO}>
                <Skeleton className="size-full rounded-(--base-radius)" />
            </AspectRatio>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-col text-xs">
                <div className="flex h-lh items-center">
                    <Skeleton className="h-3 w-full" />
                </div>
                <div className="flex h-lh items-center">
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
            <div className="flex h-4 items-center">
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
        <Skeleton className="h-5.5 w-14 shrink-0 rounded-sm" />
    </div>
);

const OngoingsWidget: FC<WidgetProps> = ({ side }) => {
    const { preferences } = useSessionUI();
    const currentSeason = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();
    const isCenter = side === 'center';

    const { list, isLoading } = useInfiniteList(homeOngoingsOptions());

    const search = {
        statuses: ['ongoing'],
        types: ['tv'],
        seasons: [currentSeason],
        years: [year, year],
        sort: 'score',
        order: 'desc',
    };

    if (isCenter) {
        return (
            <Block variant="card" id="ongoings">
                <Header>
                    <HeaderTitle to="/anime" search={search}>
                        Онґоїнґи
                    </HeaderTitle>
                </Header>
                {((list && list.length > 0) || isLoading) && (
                    <Stack size={ONGOINGS_SIZE} imagePreset="cardSm">
                        {isLoading &&
                            range(0, ONGOINGS_SIZE).map((v) => (
                                <SkeletonCard key={v} />
                            ))}
                        {list &&
                            list.length > 0 &&
                            list.map((item) => (
                                <AnimeCard
                                    item={item}
                                    key={item.slug}
                                    leftSubtitle={`${item.episodes_released ?? 0} / ${item.episodes_total ?? '?'} ${getDeclensionWord(
                                        item.episodes_total ?? 0,
                                        EPISODE_FORMS,
                                    )}`}
                                    rightSubtitle={null}
                                />
                            ))}
                    </Stack>
                )}
                {list && list.length === 0 && (
                    <EmptyState
                        icon={<MaterialSymbolsLiveTvRounded />}
                        title="Не знайдено сезонних онґоїнґів"
                        description="Сезон ще не почався або поки немає достатньо оцінених тайтлів"
                    />
                )}
            </Block>
        );
    }

    return (
        <Block variant="card" id="ongoings">
            <Header>
                <HeaderTitle to="/anime" search={search}>
                    Онґоїнґи
                </HeaderTitle>
            </Header>

            <BlockBleed className="gap-1">
                {isLoading &&
                    range(0, ONGOINGS_SIZE).map((i) => (
                        <OngoingItemSkeleton key={i} />
                    ))}

                {!isLoading &&
                    list?.map((anime, index) => {
                        return (
                            <MediaTooltip
                                key={anime.slug}
                                type={ContentTypeEnum.ANIME}
                                slug={anime.slug}
                                item={anime}
                            >
                                <Link
                                    to={`/anime/${anime.slug}`}
                                    className={cn(
                                        'group flex items-center gap-4 px-4 py-2',
                                        'transition-colors hover:bg-accent',
                                    )}
                                >
                                    <PosterCard
                                        image={anime.image}
                                        className="w-12"
                                        imagePreset="cardXs"
                                        containerClassName="rounded-(--base-radius)"
                                    />

                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <p className="line-clamp-2 font-medium text-xs group-hover:text-foreground">
                                            <span className="font-bold text-muted-foreground">
                                                #{index + 1}
                                                {' / '}
                                            </span>
                                            {getTitle(
                                                anime,
                                                preferences.title_language,
                                                preferences.name_language,
                                            )}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-xs">
                                                <span className="font-bold">
                                                    {anime.episodes_released}
                                                </span>
                                                /{anime.episodes_total ?? '?'}{' '}
                                                {getDeclensionWord(
                                                    anime.episodes_total ?? 0,
                                                    EPISODE_FORMS,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="gap-1">
                                        <span>{anime.score}</span>{' '}
                                        <MaterialSymbolsStarRounded className="size-4 text-yellow-400" />
                                    </Badge>
                                </Link>
                            </MediaTooltip>
                        );
                    })}

                {!isLoading && (!list || list.length === 0) && (
                    <EmptyState
                        size="sm"
                        icon={<MaterialSymbolsLiveTvRounded />}
                        title="Немає сезонних онґоїнґів"
                    />
                )}
            </BlockBleed>
        </Block>
    );
};

export default OngoingsWidget;
