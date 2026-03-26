'use client';

import { AnimeScheduleResponse } from '@hikka/client';
import { useTitle } from '@hikka/react';
import { FC, memo } from 'react';

import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { getScheduleDuration } from '@/utils/i18n';

interface Props {
    item: AnimeScheduleResponse;
}

const ScheduleItem: FC<Props> = ({ item }) => {
    const title = useTitle(item.anime);

    return (
        <Card>
            <HorizontalCard>
                <HorizontalCardImage
                    image={item.anime.image || undefined}
                    href={`/anime/${item.anime.slug}`}
                />
                <HorizontalCardContainer>
                    <HorizontalCardTitle href={`/anime/${item.anime.slug}`}>
                        {title}
                    </HorizontalCardTitle>
                    <HorizontalCardDescription>
                        {getScheduleDuration(item.airing_at, item.time_left)}
                    </HorizontalCardDescription>
                    <small className="text-muted-foreground opacity-60">
                        <span className="font-bold">{item.episode}</span> епізод
                    </small>
                </HorizontalCardContainer>
            </HorizontalCard>
        </Card>
    );
};

export default memo(ScheduleItem);
