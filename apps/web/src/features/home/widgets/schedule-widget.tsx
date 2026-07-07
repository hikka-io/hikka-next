import { type FC, useState } from 'react';

import { getUnixTime, startOfDay } from 'date-fns';
import { format } from 'date-fns/format';

import {
    type AnimeScheduleResponse,
    AnimeStatusEnum,
    animeScheduleInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import EmptyState from '@/components/ui/empty-state';
import { Field, FieldLabel, FieldTitle } from '@/components/ui/field';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { useSession } from '@/features/auth/hooks/use-session';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';
import { getCurrentSeason } from '@/utils/season';
import { getTitle } from '@/utils/title/get-title';

import type { WidgetProps } from '../constants';

const ScheduleWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const { preferences } = useSessionUI();
    const season = getCurrentSeason()!;
    const year = new Date().getFullYear();

    const [onlyWatch, setOnlyWatch] = useState(false);

    const { list } = useInfiniteList(
        animeScheduleInfiniteOptions({
            body: {
                airing_season: [season, year],
                status: [AnimeStatusEnum.ONGOING, AnimeStatusEnum.ANNOUNCED],
                only_watch: onlyWatch || undefined,
            },
        }),
    );

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
        <Card className="p-0" id="calendar">
            <Block className="w-full py-4">
                <Header href="/schedule" className="px-4">
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Календар</HeaderTitle>
                    </HeaderContainer>
                    {user && (
                        <FieldLabel className="h-8 w-fit! shrink-0 cursor-pointer">
                            <Field
                                orientation="horizontal"
                                className="h-full items-center"
                            >
                                <Checkbox
                                    checked={onlyWatch}
                                    onCheckedChange={(checked) =>
                                        setOnlyWatch(checked === true)
                                    }
                                    id="schedule-only-watch"
                                    name="schedule-only-watch"
                                />
                                <FieldTitle className="whitespace-nowrap font-normal text-muted-foreground text-sm">
                                    У списку
                                </FieldTitle>
                            </Field>
                        </FieldLabel>
                    )}
                    <HeaderNavButton />
                </Header>
                <div className="flex flex-col gap-1 px-2">
                    <div className="mb-1 flex items-center gap-2 px-2 text-muted-foreground text-sm">
                        <span>Сьогодні</span>
                        <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                        <span>{format(new Date(), 'd MMMM')}</span>
                    </div>
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
                                    'flex items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors hover:bg-accent',
                                    isAiringNow &&
                                        'border border-primary-border bg-primary',
                                )}
                            >
                                <span
                                    className={cn(
                                        'w-12 shrink-0 text-left font-mono text-xs',
                                        isAiringNow
                                            ? 'font-bold text-primary-foreground'
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
                                            'font-medium text-primary-foreground text-sm',
                                        isPrev && 'text-muted-foreground',
                                    )}
                                >
                                    {getTitle(
                                        item.anime,
                                        preferences.title_language,
                                        preferences.name_language,
                                    )}
                                </span>
                                <span
                                    className={cn(
                                        'shrink-0 text-muted-foreground text-xs',
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
                        <EmptyState
                            size="sm"
                            icon={<MaterialSymbolsCalendarClockRounded />}
                            title="Немає запланованих епізодів"
                        />
                    )}
                </div>
            </Block>
        </Card>
    );
};

export default ScheduleWidget;
