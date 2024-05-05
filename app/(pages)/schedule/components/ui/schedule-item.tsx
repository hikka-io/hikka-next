'use client';

import React, { FC, memo } from 'react';

import ScheduleWatchButton from '@/app/(pages)/schedule/components/ui/schedule-watch-button';
import HorizontalContentCard, {
    Props as HorizontalContentCardProps,
} from '@/components/horizontal-content-card';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import getScheduleDuration from '@/utils/getScheduleDuration';
import { cn } from '@/utils/utils';

interface Props extends Omit<HorizontalContentCardProps, 'title' | 'href'> {
    item: API.AnimeSchedule;
}

const ScheduleItem: FC<Props> = ({ item, ...props }) => {
    const getDuration = () => {
        if (item.time_left <= 0) {
            return 'Вийшло';
        }

        return getScheduleDuration(item.airing_at, item.time_left);
    };

    return (
        <HorizontalContentCard
            title={item.anime.title!}
            href={`/anime/${item.anime.slug}`}
            description={item.anime.synopsis_ua || item.anime.synopsis_en}
            image={item.anime.poster}
            {...props}
        >
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                        <H5
                            className={cn(
                                item.time_left <= 0 && 'text-muted-foreground',
                            )}
                        >
                            {getDuration()}
                        </H5>
                        <P className="text-sm text-muted-foreground">
                            <span className="font-bold text-foreground">
                                {item.episode}
                            </span>
                            /{item.anime.episodes_total || '?'}
                        </P>
                    </div>
                </div>
                <ScheduleWatchButton title={item.anime.title!} item={item} />
            </div>
        </HorizontalContentCard>
    );
};

export default memo(ScheduleItem);
