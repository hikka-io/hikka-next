'use client';

import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import React, { FC, memo } from 'react';

import Link from 'next/link';

import ScheduleWatchButton from '@/app/(pages)/schedule/components/ui/schedule-watch-button';
import EntryCard from '@/components/entry-card/entry-card';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import { cn } from '@/utils/utils';
import { Label } from '@/components/ui/label';

interface Props {
    item: API.AnimeSchedule;
}

type Tokens = 'xSeconds' | 'xMinutes' | 'xHours' | 'xDays' | 'xMonths';

const formatDistanceLocale = {
    uk: {
        xMonths: '{{count}} міс.',
        xDays: '{{count}} дн.',
        xSeconds: '{{count}} сек.',
        xMinutes: '{{count}} хв.',
        xHours: '{{count}} год.',
    },
};

export const getShortLocale = () => ({
    formatDistance: (token: Tokens, count: string) => {
        return formatDistanceLocale['uk'][token].replace('{{count}}', count);
    },
});

const ScheduleItem: FC<Props> = ({ item }) => {
    return (
        <div className="flex rounded-md border border-secondary/60 bg-secondary/30">
            <EntryCard
                className="max-w-16"
                containerClassName="rounded-r-none"
                poster={item.anime.poster}
                href={`/anime/${item.anime.slug}`}
            />
            <div className="flex w-full flex-col justify-between p-4">
                <div className="flex flex-col gap-2">
                    <Label className="line-clamp-1 w-fit cursor-pointer">
                        <Link href={`/anime/${item.anime.slug}`}>
                            {item.anime.title}
                        </Link>
                    </Label>
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between gap-4">
                        <H5
                            className={cn(
                                item.time_left <= 0 &&
                                'text-muted-foreground',
                            )}
                        >
                            {item.time_left > 0
                                ? formatDuration(
                                    intervalToDuration({
                                        start: item.airing_at * 1000,
                                        end: Date.now(),
                                    }),
                                    {
                                        format:
                                            item.time_left > 2592000
                                                ? ['months', 'days']
                                                : item.time_left > 86400
                                                    ? ['days', 'hours']
                                                    : ['hours', 'minutes'],
                                        locale: getShortLocale(),
                                    },
                                )
                                : 'Вийшло'}
                        </H5>
                        <P className="text-sm text-muted-foreground">
                                <span className="font-bold text-foreground">
                                    {item.episode}
                                </span>
                            /{item.anime.episodes_total || '?'}
                        </P>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ScheduleItem);
