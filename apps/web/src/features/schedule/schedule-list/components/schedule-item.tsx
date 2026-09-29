import { type FC, memo } from 'react';

import type { AnimeScheduleResponse } from '@hikka/api';

import { WatchListButton } from '@/components/tracking';
import { useTitle } from '@/features/auth/hooks/use-title';
import { cn } from '@/utils/cn';
import { getScheduleDuration } from '@/utils/i18n';

import ScheduleCard, { type ScheduleCardProps } from '../../schedule-card';

type Props = Omit<ScheduleCardProps, 'title' | 'href'> & {
    item: AnimeScheduleResponse;
};

const ScheduleItem: FC<Props> = ({ item, ...props }) => {
    const title = useTitle(item.anime);

    return (
        <ScheduleCard
            title={title}
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
                        <span className="font-bold text-foreground">
                            {item.episode}
                        </span>
                        /{item.anime.episodes_total || '?'}
                    </p>
                    <h5
                        className={cn(
                            item.time_left <= 0 && 'text-muted-foreground',
                        )}
                    >
                        {getScheduleDuration(item.airing_at, item.time_left)}
                    </h5>
                </div>

                <WatchListButton
                    slug={item.anime.slug}
                    anime={item.anime}
                    watch={item.anime.watch[0] ?? null}
                    size={'icon-sm'}
                />
            </div>
        </ScheduleCard>
    );
};

export default memo(ScheduleItem);
