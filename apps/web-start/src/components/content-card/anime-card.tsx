import {
    AnimeInfoResponse,
    AnimeResponse,
    ContentTypeEnum,
} from '@hikka/client';
import { FC } from 'react';

import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

interface Props extends ContentCardProps {
    anime: AnimeInfoResponse | AnimeResponse;
}

const AnimeCard: FC<Props> = ({ anime, ...props }) => {
    return (
        <ContentCard
            {...getMediaCardProps(
                anime,
                {
                    contentType: ContentTypeEnum.ANIME,
                    basePath: '/anime',
                    mediaTypeMap: ANIME_MEDIA_TYPE,
                },
                { watch: anime.watch ? anime.watch[0] : undefined },
            )}
            {...props}
        />
    );
};

export default AnimeCard;
