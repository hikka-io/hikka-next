import {
    AnimeInfoResponse,
    AnimeResponse,
    CharacterResponse,
    ContentTypeEnum,
} from '@hikka/client';
import { useTitle } from '@hikka/react';
import { FC } from 'react';

import CardOverlay from './card-overlay';
import ContentCard, { ContentCardProps } from './content-card';

interface Props extends ContentCardProps {
    character: CharacterResponse;
    anime: AnimeResponse | AnimeInfoResponse;
}

const CharacterAnimeCard: FC<Props> = ({ character, anime, ...props }) => {
    const characterTitle = useTitle(character);
    const animeTitle = useTitle(anime);

    return (
        <ContentCard
            key={character.slug + anime.slug}
            href={`/characters/${character.slug}`}
            image={character.image}
            title={characterTitle}
            slug={character.slug}
            withContextMenu
            content_type={ContentTypeEnum.CHARACTER}
            disableChildrenLink
            description={animeTitle}
            {...props}
        >
            <CardOverlay href={`/anime/${anime.slug}`} image={anime.image} />
        </ContentCard>
    );
};

export default CharacterAnimeCard;
