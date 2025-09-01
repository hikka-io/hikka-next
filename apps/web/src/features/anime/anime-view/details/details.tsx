'use client';

import { useAnimeBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';

import Card from '@/components/ui/card';

import { cn } from '@/utils/utils';

import Duration from './duration';
import EpisodeSchedule from './episode-schedule';
import Episodes from './episodes';
import MediaType from './media-type';
import Rating from './rating';
import Status from './status';
import Studio from './studio';

const Details = ({ className }: { className?: string }) => {
    const params = useParams();

    const { data } = useAnimeBySlug({ slug: String(params.slug) });

    if (!data) {
        return null;
    }

    return (
        <Card className={cn('bg-secondary/20 backdrop-blur', className)}>
            <MediaType media_type={data.media_type} />
            <Status status={data.status} />
            {data.media_type !== 'movie' && (
                <Episodes
                    status={data.status}
                    episodes_released={data.episodes_released}
                    episodes_total={data.episodes_total}
                />
            )}
            <EpisodeSchedule schedule={data.schedule} />
            <Duration duration={data.duration} />
            <Rating rating={data.rating} />
            <Studio companies={data.companies} />
        </Card>
    );
};

export default Details;
