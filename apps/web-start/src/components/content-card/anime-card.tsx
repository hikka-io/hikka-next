import type { FC } from 'react';

import { type AnimeResponseWithWatch, ContentTypeEnum } from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { type ContentCardProps } from './content-card';
import { getMediaCardProps } from './utils';

type Props = ContentCardProps & {
    anime: AnimeResponseWithWatch;
};

const AnimeCard: FC<Props> = ({ anime, ...props }) => {
    const title = useTitle(anime);

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
            title={title}
            {...props}
        />
    );
};

export default AnimeCard;
