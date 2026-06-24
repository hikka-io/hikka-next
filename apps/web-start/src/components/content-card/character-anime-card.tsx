import type { FC } from 'react';

import {
    type AnimeInfoResponse,
    type AnimeResponse,
    type CharacterResponse,
    ContentTypeEnum,
} from '@hikka/client';
import { useTitle } from '@hikka/react';

import CardOverlay from './card-overlay';
import ContentCard, { type ContentCardProps } from './content-card';

type Props = ContentCardProps & {
    character: CharacterResponse;
    anime: AnimeResponse | AnimeInfoResponse;
};

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
