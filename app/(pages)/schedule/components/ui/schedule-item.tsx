'use client';

import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import React, { memo } from 'react';

import Link from 'next/link';

import ScheduleWatchButton from '@/app/(pages)/schedule/components/ui/schedule-watch-button';
import EntryCard from '@/components/entry-card/entry-card';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { cn } from '@/utils';

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

const ScheduleItem = ({ item }: Props) => {
    const { titleLanguage } = useSettingsContext();

    const title =
        item.anime[titleLanguage!] ||
        item.anime.title_ua ||
        item.anime.title_en ||
        item.anime.title_ja;

    return (
        <div className="flex rounded-md border border-secondary/60 bg-secondary/30">
            <EntryCard
                className="max-w-36"
                containerClassName="rounded-r-none"
                poster={item.anime.poster}
                href={`/anime/${item.anime.slug}`}
            />
            <div className="flex w-full flex-col justify-between p-4">
                <div className="flex flex-col gap-2">
                    <H5 className="line-clamp-1 w-fit cursor-pointer sm:line-clamp-2">
                        <Link href={`/anime/${item.anime.slug}`}>{title}</Link>
                    </H5>
                    <MDViewer className="line-clamp-2 text-xs text-muted-foreground lg:line-clamp-3">
                        {item.anime.synopsis_ua || item.anime.synopsis_en}
                    </MDViewer>
                </div>
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex flex-1 flex-col">
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
                                <span className="font-bold">
                                    {item.episode}
                                </span>
                                /{item.anime.episodes_total || '?'}
                            </P>
                        </div>
                    </div>
                    <ScheduleWatchButton title={title} item={item} />
                </div>
            </div>
        </div>
    );
};

export default memo(ScheduleItem);
