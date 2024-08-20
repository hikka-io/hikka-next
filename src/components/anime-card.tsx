import { FC } from 'react';

import ContentCard, {
    Props as ContentCardProps,
} from '@/components/content-card/content-card';

import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';

interface Props extends ContentCardProps {
    anime: API.Anime | API.AnimeInfo;
}

const AnimeCard: FC<Props> = ({ anime, ...props }) => {
    return (
        <ContentCard
            watch={anime.watch ? anime.watch[0] : undefined}
            slug={anime.slug}
            content_type="anime"
            withContextMenu
            href={`/anime/${anime.slug}`}
            image={anime.image}
            title={anime.title}
            leftSubtitle={anime.year ? String(anime.year) : undefined}
            rightSubtitle={
                anime.media_type && ANIME_MEDIA_TYPE[anime.media_type].title_ua
            }
            {...props}
        />
    );
};

export default AnimeCard;
