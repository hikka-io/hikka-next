import { type FC, useState } from 'react';

import { getUnixTime, startOfDay } from 'date-fns';
import { format } from 'date-fns/format';

import type { AnimeScheduleResponse } from '@hikka/api';
import { getTitle } from '@hikka/core';

import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import Block from '@/components/ui/block';
import BlockBleed from '@/components/ui/block-bleed';
import { Checkbox } from '@/components/ui/checkbox';
import EmptyState from '@/components/ui/empty-state';
import { Field, FieldLabel, FieldTitle } from '@/components/ui/field';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import { useSession, useSessionUI } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import { homeScheduleOptions } from '../queries';
import type { WidgetProps } from '../types';

const ScheduleWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const { preferences } = useSessionUI();
    const [onlyWatch, setOnlyWatch] = useState(false);

    const { list } = useInfiniteList(homeScheduleOptions(onlyWatch));

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
        <Block variant="card" id="calendar">
            <Header>
                <HeaderTitle to="/schedule">Календар</HeaderTitle>
                {user && (
                    <HeaderActions>
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
                    </HeaderActions>
                )}
            </Header>
            <BlockBleed className="gap-1">
                <div className="mb-2 flex items-baseline gap-1.5 px-4 text-muted-foreground text-xs">
                    <span className="font-medium">Сьогодні</span>
                    <span className="opacity-60">
                        {format(new Date(), 'd MMMM')}
                    </span>
                </div>
                {todayItems?.map((item) => {
                    const airingTime = item.airing_at * 1000;
                    const now = Date.now();
                    const isAiringNow =
                        airingTime <= now && airingTime + 30 * 60 * 1000 > now;
                    const isPrev = !isAiringNow && airingTime < now;

                    return (
                        <Link
                            key={`${item.anime.slug}-${item.episode}`}
                            to={`/anime/${item.anime.slug}`}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-accent',
                                isAiringNow &&
                                    'border-primary-border border-y bg-primary',
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
                                    isAiringNow && 'text-primary-foreground',
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
            </BlockBleed>
        </Block>
    );
};

export default ScheduleWidget;
