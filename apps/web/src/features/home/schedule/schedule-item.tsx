'use client';

import { AnimeScheduleResponse } from '@hikka/client';
import { FC, memo } from 'react';

import Small from '@/components/typography/small';
import HorizontalContentCard from '@/components/ui/horizontal-content-card';

import getScheduleDuration from '@/utils/get-schedule-duration';

interface Props {
    item: AnimeScheduleResponse;
}

const ScheduleItem: FC<Props> = ({ item }) => {
    return (
        <HorizontalContentCard
            size="sm"
            title={item.anime.title!}
            description={getScheduleDuration(item.airing_at, item.time_left)}
            href={`/anime/${item.anime.slug}`}
            image={item.anime.image || undefined}
        >
            <Small className="text-muted-foreground opacity-60">
                <span className="font-bold">{item.episode}</span> епізод
            </Small>
        </HorizontalContentCard>
    );
};

export default memo(ScheduleItem);
