import {
    AnimeInfoResponse,
    AnimeResponse,
    ContentTypeEnum,
} from '@hikka/client';
import { FC } from 'react';

import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, { ContentCardProps } from './content-card/content-card';

interface Props extends ContentCardProps {
    anime: AnimeInfoResponse | AnimeResponse;
}

const AnimeCard: FC<Props> = ({ anime, ...props }) => {
    return (
        <ContentCard
            watch={anime.watch ? anime.watch[0] : undefined}
            slug={anime.slug}
            content_type={ContentTypeEnum.ANIME}
            withContextMenu
            href={`/anime/${anime.slug}`}
            image={anime.image}
            title={anime.title}
            leftSubtitle={anime.year ? String(anime.year) : undefined}
            rightSubtitle={
                anime.media_type
                    ? ANIME_MEDIA_TYPE[anime.media_type].title_ua
                    : undefined
            }
            {...props}
        />
    );
};

export default AnimeCard;
