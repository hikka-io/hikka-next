import type { FC } from 'react';

import type { AnimeVideoResponse } from '@hikka/api';
import { parseYouTubeThumbnail, VIDEO } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import Stack from '@/components/ui/stack';

type Props = {
    extended?: boolean;
    videos: AnimeVideoResponse[];
};

const Video: FC<Props> = ({ extended, videos }) => {
    if (!videos) {
        return null;
    }

    const filteredVideoData = extended ? videos : videos.slice(0, 3);

    return (
        <Stack
            size={3}
            extendedSize={4}
            extended={extended}
            className="grid-min-10"
            imagePreset="cardSm"
        >
            {filteredVideoData.map((video) => (
                <PosterCard
                    target="_blank"
                    key={video.url}
                    href={video.url || '#'}
                    title={video.title}
                    image={parseYouTubeThumbnail(video.url)}
                    containerRatio={1.7}
                    containerClassName="ring-1 ring-border"
                    description={
                        VIDEO[video.video_type].title_ua ||
                        VIDEO[video.video_type].title_en
                    }
                />
            ))}
        </Stack>
    );
};

export default Video;
