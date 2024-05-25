'use client';

import { FC, memo } from 'react';

import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import HorizontalContentCard from '@/components/ui/horizontal-content-card';

import getScheduleDuration from '@/utils/get-schedule-duration';
import { cn } from '@/utils/utils';

interface Props {
    item: API.AnimeSchedule;
}

const ScheduleItem: FC<Props> = ({ item }) => {
    return (
        <HorizontalContentCard
            size="sm"
            title={item.anime.title!}
            href={`/anime/${item.anime.slug}`}
            image={item.anime.poster}
        >
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                        <H5
                            className={cn(
                                item.time_left <= 0 && 'text-muted-foreground',
                            )}
                        >
                            {getScheduleDuration(
                                item.airing_at,
                                item.time_left,
                            )}
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
        </HorizontalContentCard>
    );
};

export default memo(ScheduleItem);
