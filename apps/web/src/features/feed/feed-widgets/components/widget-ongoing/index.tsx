'use client';

import { range } from '@antfu/utils';
import { AnimeMediaEnum, AnimeStatusEnum, SeasonEnum } from '@hikka/client';
import { useSearchAnimes } from '@hikka/react';
import Link from 'next/link';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { getCurrentSeason } from '@/utils/season';

const ONGOING_SIZE = 5;

const OngoingItemSkeleton = () => (
    <div className="flex items-center gap-3 rounded-sm px-2 py-1.5">
        <Skeleton className="size-10 shrink-0 rounded-sm" />
        <div className="min-w-0 flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
        </div>
        <Skeleton className="h-5 w-8 shrink-0 rounded-full" />
    </div>
);

const WidgetOngoing = () => {
    const currentSeason = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();

    const { list, isLoading } = useSearchAnimes({
        args: {
            season: [currentSeason!],
            media_type: [AnimeMediaEnum.TV],
            years: [year, year],
            genres: ['-ecchi', '-hentai'],
            status: [AnimeStatusEnum.ONGOING],
            sort: [
                'scored_by:desc',
                'score:desc',
                'native_scored_by:desc',
                'native_score:desc',
            ],
        },
        paginationArgs: {
            size: ONGOING_SIZE,
        },
    });

    return (
        <Block className="gap-4 py-4 w-full">
            <Header href="/anime?statuses=ongoing" className='px-4'>
                <HeaderContainer>
                    <HeaderTitle variant="h4">Онґоінґи</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>

            <div className="flex flex-col px-2 gap-1">
                {isLoading &&
                    range(0, ONGOING_SIZE).map((i) => (
                        <OngoingItemSkeleton key={i} />
                    ))}

                {!isLoading &&
                    list?.map((anime, index) => {
                        return (
                            <Link
                                key={anime.slug}
                                href={`/anime/${anime.slug}`}
                                className={cn(
                                    'group flex items-center gap-4 rounded-sm px-2 py-2',
                                    'transition-colors hover:bg-secondary/60',
                                )}
                            >
                                <div className='w-4'>
                                    <span className='text-xs font-semibold text-muted-foreground'>#{index + 1}</span>

                                </div>

                                {/* poster */}
                                <ContentCard image={anime.image} className='w-10'>
                                </ContentCard>

                                {/* title + meta */}
                                <div className="min-w-0 flex-1 flex flex-col gap-2">
                                    <p className="line-clamp-2 text-xs font-medium group-hover:text-foreground">
                                        {anime.title}
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-muted-foreground'>{anime.episodes_released}/{anime.episodes_total} епізодів</span>
                                    </div>
                                </div>
                                <Badge variant="outline">
                                    <span>{anime.score}</span> <MaterialSymbolsStarRounded className="text-yellow-400" />
                                </Badge>
                            </Link>
                        );
                    })}

                {!isLoading && (!list || list.length === 0) && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                        Немає сезонних онґоінґів
                    </p>
                )}
            </div>
        </Block>
    );
};

export default WidgetOngoing;
