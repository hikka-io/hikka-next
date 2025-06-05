'use client';

import { AnimeScheduleResponse } from '@hikka/client';
import { FC, memo } from 'react';

import Small from '@/components/typography/small';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import getScheduleDuration from '@/utils/get-schedule-duration';

interface Props {
    item: AnimeScheduleResponse;
}

const ScheduleItem: FC<Props> = ({ item }) => {
    return (
        <Card>
            <HorizontalCard href={`/anime/${item.anime.slug}`}>
                <HorizontalCardImage image={item.anime.image || undefined} />
                <HorizontalCardContainer>
                    <HorizontalCardTitle>
                        {item.anime.title!}
                    </HorizontalCardTitle>
                    <HorizontalCardDescription>
                        {getScheduleDuration(item.airing_at, item.time_left)}
                    </HorizontalCardDescription>
                    <Small className="text-muted-foreground opacity-60">
                        <span className="font-bold">{item.episode}</span> епізод
                    </Small>
                </HorizontalCardContainer>
            </HorizontalCard>
        </Card>
    );
};

export default memo(ScheduleItem);
