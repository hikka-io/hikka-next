import { FC } from 'react';

import ContentCard from '../../../../components/content-card/content-card';
import Stack from '../../../../components/ui/stack';
import { VIDEO } from '../../../../utils/constants/common';
import parseYouTubeThumbnail from '../../../../utils/parse-youtube-thumb';

interface Props {
    extended?: boolean;
    videos: API.Video[];
}

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
        >
            {filteredVideoData.map((video) => (
                <ContentCard
                    target="_blank"
                    key={video.url}
                    href={video.url || '#'}
                    title={video.title}
                    image={parseYouTubeThumbnail(video.url)}
                    containerRatio={1.7}
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
