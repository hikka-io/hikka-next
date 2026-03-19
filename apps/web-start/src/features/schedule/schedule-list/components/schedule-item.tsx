'use client';

import { AnimeScheduleResponse } from '@hikka/client';
import { FC, memo } from 'react';

import HorizontalContentCard, {
    Props as HorizontalContentCardProps,
} from '@/components/ui/horizontal-content-card';
import WatchlistButton from '@/features/common/watchlist-button';

import { cn } from '@/utils/cn';
import { getScheduleDuration } from '@/utils/i18n';

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
            <div className="flex w-full items-end gap-4">
                <div className="flex flex-1 flex-col justify-between gap-2">
                    <p className="text-muted-foreground text-sm">
                        <span className="text-foreground font-bold">
                            {item.episode}
                        </span>
                        /{item.anime.episodes_total || '?'}
                    </p>
                    <h5
                        className={cn(
                            item.time_left <= 0 && 'text-muted-foreground',
                        )}
                    >
                        {getDuration()}
                    </h5>
                </div>

                <WatchlistButton
                    slug={item.anime.slug}
                    anime={item.anime}
                    watch={item.anime.watch[0] ?? null}
                    size={'icon-sm'}
                />
            </div>
        </HorizontalContentCard>
    );
};

export default memo(ScheduleItem);
