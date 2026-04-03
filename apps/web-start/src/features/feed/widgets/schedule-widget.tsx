'use client';

import { AnimeScheduleResponse, ContentStatusEnum } from '@hikka/client';
import { useHikkaClient, useSearchAnimeSchedule } from '@hikka/react';
import { getTitle } from '@hikka/react/utils';
import { getUnixTime, startOfDay } from 'date-fns';
import { format } from 'date-fns/format';

import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';
import { getCurrentSeason } from '@/utils/season';

const ScheduleWidget = () => {
    const { defaultOptions } = useHikkaClient();
    const season = getCurrentSeason()!;
    const year = new Date().getFullYear();

    const { list } = useSearchAnimeSchedule({
        args: {
            airing_season: [season, year],
            status: [ContentStatusEnum.ONGOING, ContentStatusEnum.ANNOUNCED],
        },
    });

    const todayKey = String(getUnixTime(startOfDay(new Date())));

    const groupedByDay = list?.reduce(
        (acc: Record<string, AnimeScheduleResponse[]>, item) => {
            const day = String(getUnixTime(startOfDay(item.airing_at * 1000)));
            if (!(day in acc)) {
                acc[day] = [];
            }
            acc[day] = [...acc[day], item];
            return acc;
        },
        {},
    );

    const todayItems = groupedByDay?.[todayKey];

    return (
        <Card className="bg-secondary/20 p-0 backdrop-blur-xl" id="calendar">
            <Block className="w-full py-4">
                <Header href="/schedule" className="px-4">
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Календар</HeaderTitle>
                        <Badge variant="default">
                            {format(new Date(), 'd MMMM')}
                        </Badge>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <div className="flex flex-col gap-1 px-2">
                    {todayItems?.map((item) => {
                        const airingTime = item.airing_at * 1000;
                        const now = Date.now();
                        const isAiringNow =
                            airingTime <= now &&
                            airingTime + 30 * 60 * 1000 > now;
                        const isPrev = !isAiringNow && airingTime < now;

                        return (
                            <Link
                                key={`${item.anime.slug}-${item.episode}`}
                                to={`/anime/${item.anime.slug}`}
                                className={cn(
                                    'hover:bg-secondary flex items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors',
                                    isAiringNow &&
                                        'bg-primary border-primary-border border',
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
                                            'text-primary-foreground text-sm font-medium',
                                        isPrev && 'text-muted-foreground',
                                    )}
                                >
                                    {getTitle(
                                        item.anime,
                                        defaultOptions?.title,
                                        defaultOptions?.name,
                                    )}
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
                    {(!todayItems || todayItems.length === 0) && (
                        <p className="text-muted-foreground py-4 text-center text-sm">
                            Немає запланованих епізодів
                        </p>
                    )}
                </div>
            </Block>
        </Card>
    );
};

export default ScheduleWidget;
