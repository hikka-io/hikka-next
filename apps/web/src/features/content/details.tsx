'use client';

import {
    AnimeInfoResponse,
    ContentStatusEnum,
    ContentTypeEnum,
    MangaInfoResponse,
    NovelInfoResponse,
} from '@hikka/client';
import { useParams } from 'next/navigation';

import Card from '@/components/ui/card';

import { CONTENT_CONFIG } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

import Chapters from './components/details/chapters';
import Duration from './components/details/duration';
import EpisodeSchedule from './components/details/episode-schedule';
import Episodes from './components/details/episodes';
import Magazines from './components/details/magazines';
import MediaType from './components/details/media-type';
import Rating from './components/details/rating';
import Status from './components/details/status';
import Studio from './components/details/studio';
import Volumes from './components/details/volumes';

interface Props {
    className?: string;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const WatchDetails = ({
    className,
    data,
}: {
    className?: string;
    data: AnimeInfoResponse;
}) => {
    return (
        <Card className={cn('bg-secondary/20 backdrop-blur', className)}>
            <MediaType
                media_type={data.media_type}
                content_type={data.data_type}
            />
            <Status status={data.status as ContentStatusEnum | null} />
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

const ReadDetails = ({
    className,
    data,
}: {
    className?: string;
    data: MangaInfoResponse | NovelInfoResponse;
}) => {
    return (
        <Card className={cn('bg-secondary/20 backdrop-blur', className)}>
            <MediaType
                media_type={data.media_type}
                content_type={data.data_type}
            />
            <Status status={data.status} />
            <Volumes volumes={data.volumes} />
            <Chapters chapters={data.chapters} />
            <Magazines magazines={data.magazines} />
        </Card>
    );
};

const Details = ({ className, content_type }: Props) => {
    const params = useParams();

    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    if (!data) {
        return null;
    }

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return (
                <WatchDetails
                    className={className}
                    data={data as AnimeInfoResponse}
                />
            );
        case ContentTypeEnum.MANGA:
            return (
                <ReadDetails
                    className={className}
                    data={data as MangaInfoResponse | NovelInfoResponse}
                />
            );
        case ContentTypeEnum.NOVEL:
            return (
                <ReadDetails
                    className={className}
                    data={data as NovelInfoResponse}
                />
            );
    }
};

export default Details;
