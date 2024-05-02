import { FC } from 'react';

import EntryCard, {
    Props as EntryCardProps,
} from '@/components/entry-card/entry-card';
import { MEDIA_TYPE } from '@/utils/constants';

interface Props extends EntryCardProps {
    anime: API.Anime | API.AnimeInfo;
}

const AnimeCard: FC<Props> = ({ anime, ...props }) => {
    return (
        <EntryCard
            watch={anime.watch ? anime.watch[0] : undefined}
            slug={anime.slug}
            content_type="anime"
            withContextMenu
            href={`/anime/${anime.slug}`}
            poster={anime.poster}
            title={anime.title}
            leftSubtitle={anime.year ? String(anime.year) : undefined}
            rightSubtitle={
                anime.media_type && MEDIA_TYPE[anime.media_type].title_ua
            }
            {...props}
        />
    );
};

export default AnimeCard;
