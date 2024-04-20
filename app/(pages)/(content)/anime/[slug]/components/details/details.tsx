'use client';

import { useParams } from 'next/navigation';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';

import Duration from './components/duration';
import EpisodeSchedule from './components/episode-schedule';
import Episodes from './components/episodes';
import MediaType from './components/media-type';
import Rating from './components/rating';
import Status from './components/status';
import Studio from './components/studio';

const Details = () => {
    const params = useParams();

    const { data } = useAnimeInfo({ slug: String(params.slug) });

    if (!data) {
        return null;
    }

    return (
        <Block>
            <Header title="Деталі" />
            <Card>
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
        </Block>
    );
};

export default Details;
