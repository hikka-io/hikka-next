'use client';

import { AnimeScheduleResponse } from '@hikka/client';
import { FC, memo } from 'react';

import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import HorizontalContentCard, {
    Props as HorizontalContentCardProps,
} from '@/components/ui/horizontal-content-card';

import getScheduleDuration from '@/utils/get-schedule-duration';
import { cn } from '@/utils/utils';

import ScheduleWatchButton from './schedule-watch-button';

interface Props extends Omit<HorizontalContentCardProps, 'title' | 'href'> {
    item: AnimeScheduleResponse;
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
            description={
                item.anime.synopsis_ua || item.anime.synopsis_en || undefined
            }
            image={item.anime.image || undefined}
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
                        <P className="text-muted-foreground text-sm">
                            <span className="text-foreground font-bold">
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
