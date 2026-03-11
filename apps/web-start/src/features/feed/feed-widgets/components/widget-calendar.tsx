'use client';

import { ContentStatusEnum, SeasonEnum } from '@hikka/client';
import { useSearchAnimeSchedule } from '@hikka/react';
import { format } from 'date-fns';
import { Link } from '@/utils/navigation';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import { cn } from '@/utils/cn';
import { getCurrentSeason } from '@/utils/season';

const WidgetCalendar = () => {
    const search = useFilterSearch<{
        season?: string;
        year?: string | number;
    }>();

    const season =
        (search.season as SeasonEnum) || getCurrentSeason()!;
    const year = search.year || new Date().getFullYear();
    const status = [
        ContentStatusEnum.ONGOING,
        ContentStatusEnum.ANNOUNCED,
    ] as ContentStatusEnum[];

    const { list } = useSearchAnimeSchedule({
        args: {
            airing_season: [season, Number(year)],
            status,
        },
    });

    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayItems = list
        ?.filter((item) => {
            const airingDate = item.airing_at * 1000;
            return (
                airingDate >= todayStart.getTime() &&
                airingDate <= todayEnd.getTime()
            );
        })
        .slice(0, 6);

    const upcomingItems =
        todayItems && todayItems.length > 0
            ? todayItems
            : list?.filter((item) => item.airing_at * 1000 > now).slice(0, 6);

    return (
        <Block className='py-4 w-full'>
            <Header href="/schedule" className='px-4'>
                <HeaderContainer>
                    <HeaderTitle variant="h4">Календар</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <div className="flex flex-col gap-1 px-2">
                {upcomingItems?.map((item) => {
                    const airingTime = item.airing_at * 1000;
                    const isAiringNow =
                        airingTime <= now &&
                        airingTime + 30 * 60 * 1000 > now;
                    const isPrev = !isAiringNow && airingTime < now;

                    return (
                        <Link
                            key={`${item.anime.slug}-${item.episode}`}
                            to={`/anime/${item.anime.slug}`}
                            className={cn(
                                'flex items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors hover:bg-secondary',
                                isAiringNow &&
                                'bg-primary border border-primary-border',
                            )}
                        >
                            <span
                                className={cn(
                                    'w-12 shrink-0 text-left font-mono text-xs',
                                    isAiringNow
                                        ? 'text-primary-foreground font-bold'
                                        : 'text-muted-foreground',
                                    isPrev && 'text-muted-foreground',
                                )}
                            >
                                {format(airingTime, 'HH:mm')}
                            </span>
                            <span
                                className={cn(
                                    'min-w-0 flex-1 truncate',
                                    isAiringNow &&
                                    'text-primary-foreground font-medium text-sm',
                                    isPrev && 'text-muted-foreground',
                                )}
                            >
                                {item.anime.title}
                            </span>
                            <span
                                className={cn(
                                    'text-muted-foreground shrink-0 text-xs',
                                    isAiringNow &&
                                    'text-primary-foreground',
                                    isPrev && 'text-muted-foreground',
                                )}
                            >
                                Епізод {item.episode}
                            </span>
                        </Link>
                    );
                })}
                {(!upcomingItems || upcomingItems.length === 0) && (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                        Немає запланованих епізодів
                    </p>
                )}
            </div>
        </Block>
    );
};

export default WidgetCalendar;
