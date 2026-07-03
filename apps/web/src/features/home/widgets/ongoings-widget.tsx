import type { FC } from 'react';

import { range } from '@antfu/utils';

import {
    AnimeMediaEnum,
    AnimeStatusEnum,
    type SeasonEnum,
    searchAnimeInfiniteOptions,
} from '@hikka/api';

import { AnimeTooltip } from '@/components/content-card';
import AnimeCard from '@/components/content-card/anime-card';
import ContentCard from '@/components/content-card/content-card';
import SkeletonCard from '@/components/content-card/content-card-skeleton';
import MaterialSymbolsLiveTvRounded from '@/components/icons/material-symbols/MaterialSymbolsLiveTvRounded';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Skeleton } from '@/components/ui/skeleton';
import Stack from '@/components/ui/stack';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { getOngoingsSort } from '@/features/filters/sort';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { getDeclensionWord } from '@/utils/i18n';
import { Link } from '@/utils/navigation';
import { getCurrentSeason } from '@/utils/season';
import { getTitle } from '@/utils/title/get-title';

import type { WidgetProps } from '../constants';

const SIDEBAR_SIZE = 5;
const CENTER_SIZE = 5;
const EPISODE_DECLENSIONS: [string, string, string] = [
    'епізод',
    'епізоди',
    'епізодів',
];

const OngoingItemSkeleton = () => (
    <div className="flex items-center gap-3 rounded-sm px-2 py-1.5">
        <Skeleton className="size-10 shrink-0 rounded-sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
        </div>
        <Skeleton className="h-5 w-8 shrink-0 rounded-full" />
    </div>
);

const OngoingsWidget: FC<WidgetProps> = ({ side }) => {
    const { preferences } = useSessionUI();
    const currentSeason = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();
    const isCenter = side === 'center';

    const { list, isLoading } = useInfiniteList(
        searchAnimeInfiniteOptions({
            body: {
                season: [currentSeason!],
                media_type: [AnimeMediaEnum.TV],
                years: [year, year],
                genres: ['-ecchi', '-hentai'],
                status: [AnimeStatusEnum.ONGOING],
                sort: getOngoingsSort(),
            },
            query: {
                size: isCenter ? CENTER_SIZE : SIDEBAR_SIZE,
            },
        }),
    );

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
            <Card className="p-0" id="ongoings">
                <Block className="w-full gap-4 py-4">
                    <Header href="/anime" search={search} className="px-4">
                        <HeaderContainer>
                            <HeaderTitle variant="h4">Онґоїнґи</HeaderTitle>
                        </HeaderContainer>
                        <HeaderNavButton />
                    </Header>
                    {((list && list.length > 0) || isLoading) && (
                        <Stack
                            size={CENTER_SIZE}
                            imagePreset="cardSm"
                            className="mx-0 px-4"
                        >
                            {isLoading &&
                                range(0, CENTER_SIZE).map((v) => (
                                    <SkeletonCard key={v} />
                                ))}
                            {list &&
                                list.length > 0 &&
                                list.map((item) => (
                                    <AnimeCard anime={item} key={item.slug} />
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
            </Card>
        );
    }

    return (
        <Card className="p-0" id="ongoings">
            <Block className="w-full gap-4 py-4">
                <Header href="/anime" search={search} className="px-4">
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Онґоїнґи</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>

                <div className="flex flex-col gap-1 px-2">
                    {isLoading &&
                        range(0, SIDEBAR_SIZE).map((i) => (
                            <OngoingItemSkeleton key={i} />
                        ))}

                    {!isLoading &&
                        list?.map((anime, index) => {
                            return (
                                <AnimeTooltip
                                    key={anime.slug}
                                    slug={anime.slug}
                                    watch={
                                        anime.watch.length > 0
                                            ? anime.watch[0]
                                            : undefined
                                    }
                                >
                                    <Link
                                        to={`/anime/${anime.slug}`}
                                        className={cn(
                                            'group flex items-center gap-4 rounded-sm px-2 py-2',
                                            'transition-colors hover:bg-secondary/60',
                                        )}
                                    >
                                        <ContentCard
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
                                                        {
                                                            anime.episodes_released
                                                        }
                                                    </span>
                                                    /
                                                    {anime.episodes_total ??
                                                        '?'}{' '}
                                                    {getDeclensionWord(
                                                        anime.episodes_total ??
                                                            0,
                                                        EPISODE_DECLENSIONS,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="gap-1"
                                        >
                                            <span>{anime.score}</span>{' '}
                                            <MaterialSymbolsStarRounded className="size-4 text-yellow-400" />
                                        </Badge>
                                    </Link>
                                </AnimeTooltip>
                            );
                        })}

                    {!isLoading && (!list || list.length === 0) && (
                        <EmptyState
                            size="sm"
                            icon={<MaterialSymbolsLiveTvRounded />}
                            title="Немає сезонних онґоїнґів"
                        />
                    )}
                </div>
            </Block>
        </Card>
    );
};

export default OngoingsWidget;
