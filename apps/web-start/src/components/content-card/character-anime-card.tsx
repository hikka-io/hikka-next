import {
    AnimeInfoResponse,
    AnimeResponse,
    CharacterResponse,
    ContentTypeEnum,
} from '@hikka/client';
import { FC } from 'react';

import CardOverlay from './card-overlay';
import ContentCard, { ContentCardProps } from './content-card';

interface Props extends ContentCardProps {
    character: CharacterResponse;
    anime: AnimeResponse | AnimeInfoResponse;
}

const CharacterAnimeCard: FC<Props> = ({ character, anime, ...props }) => {
    return (
        <ContentCard
            key={character.slug + anime.slug}
            href={`/characters/${character.slug}`}
            image={character.image}
            title={character.name_ua || character.name_en || character.name_ja}
            slug={character.slug}
            withContextMenu
            content_type={ContentTypeEnum.CHARACTER}
            disableChildrenLink
            description={anime.title}
            {...props}
        >
            <CardOverlay href={`/anime/${anime.slug}`} image={anime.image} />
        </ContentCard>
    );
};

export default CharacterAnimeCard;
