'use client';

import { FC, memo } from 'react';

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
            image={item.anime.image}
        >
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                        <P
                            className={cn(
                                'text-sm',
                                item.time_left <= 0 && 'text-muted-foreground',
                            )}
                        >
                            {getScheduleDuration(
                                item.airing_at,
                                item.time_left,
                            )}
                        </P>
                        <P className="text-sm">
                            <span className="font-bold text-foreground">
                                {item.episode}
                            </span>{' '}
                            епізод
                        </P>
                    </div>
                </div>
            </div>
        </HorizontalContentCard>
    );
};

export default memo(ScheduleItem);
